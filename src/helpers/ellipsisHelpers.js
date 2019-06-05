/* eslint-disable no-param-reassign */
import { ELLIPSIS } from '../utils/constants'
// helpers
import { cleanRegex } from './wordOccurrenceHelpers'

function indexPlusOneIsOdd(n) {
  return !((n + 1) % 2 == 0)
}

function validateChunk(verseString, chunk) {
  if (chunk && verseString && !verseString.includes(chunk)) return chunk.trim()
  return chunk
}

function getStrPrecedingPreviousChunk(verseString, previousChunk, currentChunk, nextChunk) {
  let result = null
  previousChunk = validateChunk(verseString, previousChunk)
  currentChunk = validateChunk(verseString, currentChunk)
  nextChunk = validateChunk(verseString, nextChunk)

  const regex = quote => new RegExp(cleanRegex(quote), 'g')
  const previousChunkMatches = verseString.match(regex(previousChunk)) || []
  const currentChunkMatches = verseString.match(regex(currentChunk)) || []
  const nextChunkMatches = verseString.match(regex(nextChunk)) || []

  if (previousChunk && previousChunkMatches.length === 1) {
    // console.log('a')
    const cutoffIndex = verseString.indexOf(previousChunk)
    result = verseString.slice(0, cutoffIndex)
  } else if (currentChunkMatches.length === 1) {
    // console.log('b')
    const cutoffIndex = verseString.indexOf(currentChunk)
    const strPrecedingCurrentChunk = verseString.slice(0, cutoffIndex)
    const previousChunkCutoff = strPrecedingCurrentChunk.lastIndexOf(previousChunk)
    result = verseString.slice(0, previousChunkCutoff)
  } else if (previousChunk && previousChunkMatches.length >= 2) {
    // console.log('c')
    const verseChunks = verseString.split(previousChunk)
    const foundIndex = verseChunks.findIndex(verseChunk => verseChunk.includes(currentChunk))
    result = verseChunks.slice(0, foundIndex + 1).join(previousChunk)
  } else if (nextChunk && nextChunkMatches.length === 1) {
    // console.log('d')

    const cutoffIndex = verseString.indexOf(nextChunk)
    result = verseString.slice(0, cutoffIndex)
  } else if (nextChunk && nextChunkMatches.length >= 2) {
    // console.log('e')
    const verseChunks = verseString.split(nextChunk)
    const foundIndex = verseChunks.findIndex(verseChunk => verseChunk.includes(currentChunk))
    result = verseChunks.slice(0, foundIndex + 1).join(nextChunk)
  }

  if (!result) console.error('PROBLEM WITH getStrPrecedingPreviousChunk()')

  return result
}

function getQuoteChunkSubStrIndex(verseString, previousQuoteChunk, quoteChunk, nextQuoteChunk) {
  let result
  let useLastIndexOf = false
  const splittedVerse = verseString.split(previousQuoteChunk)
  const regex = new RegExp(quoteChunk, 'g')
  const matches = splittedVerse[1] ? splittedVerse[1].match(regex) || [] : []

  if (splittedVerse.length === 2 && matches.length === 1) {
    console.log('1st happens')
    useLastIndexOf = splittedVerse[0].includes(quoteChunk)
    // eslint-disable-next-line prettier/prettier
    result = useLastIndexOf ?
      verseString.lastIndexOf(quoteChunk) : verseString.indexOf(quoteChunk)
  } else if (splittedVerse.length === 2 && matches.length >= 2) {
    console.log('2nd happens')
    // string before missing words
    const strBefore = getStrPrecedingPreviousChunk(verseString, previousQuoteChunk, quoteChunk, nextQuoteChunk) + previousQuoteChunk
    const strAfter = verseString.replace(strBefore, '')
    result = strBefore.length + strAfter.indexOf(quoteChunk)
  } else if (splittedVerse.filter(str => str.includes(quoteChunk)).length >= 2) {
    console.log('3rd happens')
    // string before missing words
    const strBefore = getStrPrecedingPreviousChunk(verseString, previousQuoteChunk, quoteChunk, nextQuoteChunk) + previousQuoteChunk
    const strAfter = verseString.replace(strBefore, '')
    result = strBefore.length + strAfter.indexOf(quoteChunk)
  } else {
    console.log('4th happens')
    result = verseString.indexOf(quoteChunk)
  }

  return result
}

export function getOmittedWordsInQuote(quote, verseString) {
  // replace weird quotation marks with correct ones
  quote = quote.replace(/\”/gi, '"').replace(/\“/gi, '"')
  quote = quote.replace(/\.../gi, ELLIPSIS)
  const quoteChunks = quote.split(ELLIPSIS)
  const missingWordsIndices = []

  quoteChunks.forEach((quoteChunk, index) => {
    let quoteChunkSubStrIndex
    const previousQuoteChunk = validateChunk(verseString, quoteChunks[index - 1])
    let nextQuoteChunk = validateChunk(verseString, quoteChunks[index + 1])

    // if index plus one is odd & is not the last item in the array
    if (indexPlusOneIsOdd(index) && index < quoteChunks.length - 1 && index !== 2) {
      console.log('1.')
      if (!verseString.includes(nextQuoteChunk)) nextQuoteChunk = nextQuoteChunk.trim()
      // const splittedVerse = verseString.split(quoteChunk)
      // const useLastIndexOf = splittedVerse.length === 2 ? splittedVerse[0].includes(nextQuoteChunk) : false
      // eslint-disable-next-line prettier/prettier
      // const nextChunkIndex = useLastIndexOf ?
      //   verseString.lastIndexOf(nextQuoteChunk) : verseString.indexOf(nextQuoteChunk)

      // if (nextChunkIndex) {
      const strBeforeNextQuote = getStrPrecedingPreviousChunk(verseString, previousQuoteChunk, quoteChunk, nextQuoteChunk) || ''
      // TRICKY: in some cases the chunck isnt found in the preceding string because of extra space in the string.
      if (!strBeforeNextQuote.includes(quoteChunk)) {
        quoteChunk = quoteChunk.trim()
        quoteChunks[index] = quoteChunk
      }

      // Determine whether to use the last Index or first index of quoteChunk
      const lastIndexOfQuoteChunk = strBeforeNextQuote.lastIndexOf(quoteChunk)
      if (lastIndexOfQuoteChunk + quoteChunk.length === strBeforeNextQuote.length) {
        const precedingLastQuoteChunkoccurrence = strBeforeNextQuote.slice(lastIndexOfQuoteChunk)
        if (precedingLastQuoteChunkoccurrence.includes(quoteChunk)) {
          // if quote chunk is found again in preceding string
          quoteChunkSubStrIndex = strBeforeNextQuote.indexOf(quoteChunk)
        }
      } else {
        quoteChunkSubStrIndex = strBeforeNextQuote.lastIndexOf(quoteChunk)
      }
      // }

      missingWordsIndices.push(quoteChunkSubStrIndex + (index === 0 ? quoteChunk.length : 0))
    } else if ((index === quoteChunks.length - 1 || index >= 2) && quoteChunks.length >= 3) {
      console.log('2.')

      // Determine whether to use the last Index or first index of quoteChunk.
      // if it's the last quoteChunk in the array use lastIndexOf string.
      const useLastIndexOf = quoteChunks.length === index + 1
      // eslint-disable-next-line prettier/prettier
      const lastMissingWordEndingIndex = useLastIndexOf ?
        verseString.lastIndexOf(quoteChunk) : verseString.indexOf(quoteChunk)
      const sliced = verseString.slice(lastMissingWordEndingIndex)
      const stringPrecedingLastChunk = verseString.replace(sliced, '')
      const matches = verseString.match(new RegExp(quoteChunk, 'g'))
      let startIndex

      if (matches && matches.length >= 3) {
        const strBefore = getStrPrecedingPreviousChunk(verseString, previousQuoteChunk, quoteChunk, nextQuoteChunk) + previousQuoteChunk
        startIndex = strBefore.length
      } else {
        startIndex = stringPrecedingLastChunk.lastIndexOf(previousQuoteChunk) + previousQuoteChunk.length
      }

      missingWordsIndices.push(startIndex + (index === 0 ? quoteChunk.length : 0))
      if (!verseString.includes(quoteChunk)) {
        quoteChunk = quoteChunk.trim()
        quoteChunks[index] = quoteChunk
      }

      // eslint-disable-next-line prettier/prettier
      const endIndex = useLastIndexOf ?
        verseString.lastIndexOf(quoteChunk) : verseString.indexOf(quoteChunk)

      missingWordsIndices.push(endIndex + (index === 0 ? quoteChunk.length : 0))
    } else {
      console.log('3.')

      if (!verseString.includes(quoteChunk)) {
        quoteChunk = quoteChunk.trim()
        quoteChunks[index] = quoteChunk
      }
      // Determine whether to use the last Index or first index of quoteChunk.
      // let useLastIndexOf = false
      // let indexNextToPreviousChunk
      // const splittedVerse = verseString.split(previousQuoteChunk)
      // const regex = new RegExp(quoteChunk, 'g')

      // if (splittedVerse.length === 2 && splittedVerse[1].match(regex).length === 1) {
      //   console.log('happens')
      //   useLastIndexOf = splittedVerse[0].includes(quoteChunk)
      // } else if (splittedVerse.length === 2 && splittedVerse[1].match(regex).length >= 2) {
      //   console.log('happens 2')
      //   // string before missing words
      //   const strBefore = getStrPrecedingPreviousChunk(verseString, previousQuoteChunk, quoteChunk, nextQuoteChunk) + previousQuoteChunk
      //   const strAfter = verseString.replace(str, '')
      //   indexNextToPreviousChunk = strBefore.length - 1 + strAfter.indexOf(quoteChunk)
      // }

      quoteChunkSubStrIndex = getQuoteChunkSubStrIndex(verseString, previousQuoteChunk, quoteChunk, nextQuoteChunk)

      missingWordsIndices.push(quoteChunkSubStrIndex + (index === 0 ? quoteChunk.length : 0))
    }
  })

  const omittedStrings = []
  missingWordsIndices.forEach((startIndex, i) => {
    if (!((i + 1) % 2 == 0)) {
      // if index is odd number
      const endIndex = missingWordsIndices[i + 1]
      const missingString = verseString.slice(startIndex, endIndex)
      omittedStrings.push(missingString)
    }
  })

  let wholeQuote = ''
  quoteChunks.forEach((chunk, index) => {
    const missingWord = omittedStrings[index] || ''
    wholeQuote = wholeQuote + chunk + missingWord
  })

  // clean string
  wholeQuote = wholeQuote.replace(/  /gi, ' ').trim()
  // console.log('omittedStrings', omittedStrings)
  // console.log('missingWordsIndices', missingWordsIndices)

  return {
    wholeQuote,
    omittedStrings,
  }
}
