import fs from 'fs-extra';
import path from 'path-extra';
import { getGroupName } from './helpers/resourcesHelpers';

/**
 * take this category and make sure it is in a group
 * @param {String} groupId
 * @param {Object} categorizedGroupsIndex
 * @param {String} categoryName
 * @param {String} taCategoriesPath
 * @param {String} taArticleCategory
 */
const addCategoryToGroup = (groupId, categorizedGroupsIndex, categoryName,taCategoriesPath, taArticleCategory) => {
  const fileName = groupId + '.md';
  const articlePath = path.join(taCategoriesPath, taArticleCategory, fileName);
  const groupName = getGroupName(articlePath);
  const groupIndexItem = getGroupIndex(groupId, groupName);

  // Only add the groupIndexItem if it isn't already in the category's groups index.
  if (!categorizedGroupsIndex[categoryName].some(e => e.id === groupIndexItem.id)) {
    categorizedGroupsIndex[categoryName].push(groupIndexItem); // adding group Index Item
  }
};

export const generateGroupsIndex = (tnCategoriesPath, taCategoriesPath) => {
  const categorizedGroupsIndex = {
    discourse: [],
    numbers: [],
    figures: [],
    culture: [],
    grammar: [],
    other: [],
  };
  const errors = [];

  const isDirectory = item => fs.lstatSync(path.join(tnCategoriesPath, item)).isDirectory();
  const categories = fs.readdirSync(tnCategoriesPath).filter(isDirectory);

  categories.forEach(categoryName => {
    const booksPath = path.join(tnCategoriesPath, categoryName, 'groups');
    const books = fs.readdirSync(booksPath).filter(item => item !== '.DS_Store');

    books.forEach(bookid => {
      const groupDataPath = path.join(booksPath, bookid);
      const groupDataFiles = fs.readdirSync(groupDataPath).filter(filename => path.extname(filename) === '.json');
      let taArticleCategory;
      let groupName;

      groupDataFiles.forEach(groupDataFile => {
        try {
          const filePath = path.join(groupDataPath, groupDataFile);
          const groupId = groupDataFile.replace('.json', '');
          const groupData = fs.readJsonSync(filePath);
          taArticleCategory = null;
          groupName = null;
          let categoryFound = false;

          if (groupData.length > 0) {
            for (let i = 0; i < groupData.length; i++ ) {
              const contextId = groupData[i].contextId;
              taArticleCategory = getArticleCategory(contextId.occurrenceNote, groupId);

              try {
                if (!taArticleCategory) {
                  throw new Error(`Link in Occurrence Note ${contextId.occurrenceNote} does not have category for check at index: ${i}`);
                }

                addCategoryToGroup(groupId, categorizedGroupsIndex, categoryName, taCategoriesPath, taArticleCategory);
                categoryFound = true;
                break; // we got the category, so don't need to search anymore
              } catch (e) {
                let message = `error finding group name: groupId: ${groupId}, index: ${i} in bookId ${bookid} `;
                console.error('generateGroupsIndex() - ' + message, e);
                errors.push(message + e.toString());
              }
            }

            if (!categoryFound) {
              addCategoryToGroup('other', categorizedGroupsIndex, categoryName, taCategoriesPath, taArticleCategory); // add entry even though we could not find localized description
              throw new Error(`Could not find category for ${groupId}`);
            }
          }
        } catch (e) {
          let message = `error processing entry: bookid: ${bookid}, groupDataFile: ${groupDataFile}, taArticleCategory: ${taArticleCategory}, groupName: ${groupName}: `;
          console.error('generateGroupsIndex() - ' + message, e);
          errors.push(message + e.toString());
        }
      });
    });
  });

  if (errors.length) {
    throw new Error(`generateGroupsIndex() - error processing index:\n${errors.join('\n')}`);
  }

  return categorizedGroupsIndex;
};

/**
 * Gets the category of the given groupId from the links in the occurrenceNote
 * @param {string} occurrenceNote
 * @param {string} groupId
 * @returns {string} the matched category
 */
export const getArticleCategory = (occurrenceNote, groupId) => {
  if (occurrenceNote && groupId) {
    const pattern = '(?<=rc:\\/\\/[^\\/]+\\/ta\\/man\\/)[^\\/]+?(?=\\/' + groupId + ')';
    const categoryRE = new RegExp(pattern);
    const match = occurrenceNote.match(categoryRE);

    if (match) {
      return match[0];
    }
  }
  return null;
};

const getGroupIndex = (groupId, groupName) => ({
  id: groupId,
  name: groupName,
});
