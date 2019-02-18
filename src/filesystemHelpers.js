import fs from 'fs-extra'
import path from 'path-extra'

/**
 * Formats and saves the groupData into the 5 tN categories in the desired
 * filesystem structure (lexical, figures, cultural, morphological and other)
 * which include all the json files for the catgory based on the tA articles
 * @param {object} categorizedGroupData groupData categorized in 5 categories:
 * lexical, figures, cultural, morphological and other.
 * @param {string} rootDestinationPath root directory where the files will be saved.
 * @param {string} bookId book id.
 */
export const formatAndSaveGroupData = (categorizedGroupData, rootDestinationPath, bookId) => {
  return new Promise((resolve, reject) => {
    try {
      Object.keys(categorizedGroupData).forEach(categoryName => {
        const categoryData = categorizedGroupData[categoryName];
        Object.keys(categoryData).forEach(groupId => {
          const filename = groupId + '.json'
          const groupData = categoryData[groupId]
          const savePath = path.join(rootDestinationPath, categoryName, 'groups', bookId, filename)

          fs.outputJsonSync(savePath, groupData)
        })
      })
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}
