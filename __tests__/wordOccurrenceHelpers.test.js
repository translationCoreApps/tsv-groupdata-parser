jest.unmock('fs-extra')
import path from 'path-extra'
import ManageResource from '../src/ManageResource'
import {getWordOccurrencesForQuote} from '../src/wordOccurrenceHelpers'

function getTestResult(bookId, chapter, verse, quote) {
  const originalBiblePath = path.join('__tests__', 'fixtures', 'resources', 'el-x-koine', 'bibles', 'ugnt', 'v0.5')
  const resourceApi = new ManageResource(originalBiblePath, bookId)
  const verseString = resourceApi.getVerseString(chapter, verse)
  const words = getWordOccurrencesForQuote(quote, verseString)

  return words;
}

describe('getOccurrencesForQuote():', () => {
  // test('', () => {
  //   const quote = "οὔτε‘ ἐνκατελείφθη εἰς ᾍδην"
  //   const words = getTestResult('act', 2, 31, quote)
  //   const expected = [
  //     {
  //       word: "οὔτε",
  //       occurrence: 1,
  //     },
  //     {
  //       word: "‘ ",// take a look at this
  //       occurrence: 1,
  //     },
  //     {
  //       word: "ἐνκατελείφθη",
  //       occurrence: 1,
  //     },
  //     {
  //       word: "εἰς",
  //       occurrence: 1,
  //     },
  //     {
  //       word: "ᾍδην",
  //       occurrence: 1,
  //     },
  //   ]

  //   expect(words).toEqual(expected)
  // })

  test('should generate an array of objects for an original language quote with ellipses', () => {
    const checks = [
      {
        bookId: 'tit',
        chapter: 1,
        verse: 15,
        quote: "τοῖς ... μεμιαμμένοις καὶ ἀπίστοις, οὐδὲν καθαρόν",// omitted δὲ
        expected: [
          {
            word: "τοῖς",
            occurrence: 2,
          },
          {
            word: "μεμιαμμένοις",
            occurrence: 1,
          },
          {
            word: "καὶ",
            occurrence: 1,
          },
          {
            word: "ἀπίστοις",
            occurrence: 1,
          },
          {
            word: ",",
            occurrence: 1,
          },
          {
            word: "οὐδὲν",
            occurrence: 1,
          },
          {
            word: "καθαρόν",
            occurrence: 1,
          },
        ]
      },
      // {
      //   bookId: 'act',
      //   chapter: 1,
      //   verse: 2,
      //   quote: "ἄχρι ἧς ἡμέρας ... ἀνελήμφθη",// omitted: ἐντειλάμενος τοῖς ἀποστόλοις διὰ Πνεύματος Ἁγίου , οὓς ἐξελέξατο,
      //   expected: []
      // },
      // {
      //   bookId: 'act',
      //   chapter: 1,
      //   verse: 2,
      //   quote: "ἐντειλάμενος ... διὰ Πνεύματος Ἁγίου",// omitted "τοῖς ἀποστόλοις"
      //   expected: []
      // },
      // {
      //   bookId: 'act',
      //   chapter: 15,
      //   verse: 2,
      //   quote: "στάσεως καὶ ζητήσεως οὐκ ὀλίγης ... πρὸς αὐτοὺς",// omitted τῷ Παύλῳ καὶ τῷ Βαρναβᾷ
      //   expected: []
      // },
      // {
      //   bookId: 'act',
      //   chapter: 1,
      //   verse: 10,
      //   quote: "ἀτενίζοντες ... εἰς τὸν οὐρανὸν", // omitted ἦσαν
      //   expected: []
      // },
      // {
      //   bookId: 'act',
      //   chapter: 3,
      //   verse: 21,
      //   quote: "στόματος τῶν ἁγίων ... αὐτοῦ προφητῶν", // omitted: ἀπ’ αἰῶνος
      //   expected: []
      // },
      // {
      //   bookId: 'mat',
      //   chapter: 1,
      //   verse: 5,
      //   quote: "Σαλμὼν ... ἐγέννησεν τὸν Βόες ἐκ τῆς Ῥαχάβ", // omitted: δὲ
      //   expected: []
      // },
      // {
      //   bookId: 'mat',
      //   chapter: 1,
      //   verse: 12,
      //   quote: "τὸν Σαλαθιήλ, Σαλαθιὴλ ... ἐγέννησεν τὸν Ζοροβαβέλ", // omitted: δὲ
      //   expected: []
      // },
      // {
      //   bookId: 'mat',
      //   chapter: 1,
      //   verse: 18,
      //   quote: "πρὶν ... συνελθεῖν αὐτοὺς", // omitted: ἢ
      //   expected: []
      // },
      // {
      //   bookId: 'mat',
      //   chapter: 1,
      //   verse: 24,
      //   quote: "ὡς προσέταξεν ... ὁ ἄγγελος Κυρίου", // omitted: αὐτῷ
      //   expected: []
      // },
      // {
      //   bookId: 'mat',
      //   chapter: 2,
      //   verse: 13,
      //   quote: "ἕως ... εἴπω σοι", // omitted:ἂν
      //   expected: []
      // },
      // {
      //   bookId: 'rom',
      //   chapter: 1,
      //   verse: 18,
      //   quote: "τὴν ἀλήθειαν ... κατεχόντων", // omitted: ἐν ἀδικίᾳ
      //   expected: []
      // },
      // {
      //   bookId: 'rom',
      //   chapter: 1,
      //   verse: 27,
      //   quote: "καὶ ... ἄρσενες ἀφέντες τὴν φυσικὴν χρῆσιν τῆς θηλείας", // omitted: οἱ
      //   expected: []
      // },
    ]

    checks.forEach(({ bookId, chapter, verse, quote, expected}) => {
      const result = getTestResult(bookId, chapter, verse, quote)
      expect(result).toEqual(expected)
    })
  })

  // test('should generate an array of objects for an original language quote', () => {
  //   const quote = "Κρῆτες ἀεὶ ψεῦσται"
  //   const result = getTestResult('tit', 1, 12, quote)
  //   const expected = [
  //     {
  //       word: "Κρῆτες",
  //       occurrence: 1,
  //     },
  //     {
  //       word: "ἀεὶ",
  //       occurrence: 1,
  //     },
  //     {
  //       word: "ψεῦσται",
  //       occurrence: 1,
  //     }
  //   ]

  //   expect(result).toEqual(expected)
  // })

  // test('', () => {
  //   const quote = "ἐν κακίᾳ καὶ φθόνῳ διάγοντες"
  //   const result = getTestResult('tit', 3, 3, quote)
  //   const expected = [
  //     {
  //       word: "ἐν",
  //       occurrence: 1,
  //     },
  //     {
  //       word: "κακίᾳ",
  //       occurrence: 1,
  //     },
  //     {
  //       word: "καὶ",
  //       occurrence: 3,
  //     },
  //     {
  //       word: "φθόνῳ",
  //       occurrence: 1,
  //     },
  //     {
  //       word: "διάγοντες",
  //       occurrence: 1,
  //     },
  //   ]

  //   expect(result).toEqual(expected)
  // })

  // test('', () => {
  //   const quote = "ματαιολόγοι, καὶ φρεναπάται"
  //   const words = getTestResult('tit', 1, 10, quote)
  //   const expected = [
  //     {
  //       word: "ματαιολόγοι",
  //       occurrence: 1,
  //     },
  //     {
  //       word: ",",
  //       occurrence: 2,
  //     },
  //     {
  //       word: "καὶ",
  //       occurrence: 2,
  //     },
  //     {
  //       word: "φρεναπάται",
  //       occurrence: 1,
  //     },
  //   ]

  //   expect(words).toEqual(expected)
  // })


  // test('', () => {
  //   const quote = "Κλαύδιος Λυσίας, τῷ κρατίστῳ ἡγεμόνι Φήλικι, χαίρειν"
  //   const words = getTestResult('act', 23, 26, quote)
  //   const expected = [
  //     {
  //       word: "Κλαύδιος",
  //       occurrence: 1,
  //     },
  //     {
  //       word: "Λυσίας",
  //       occurrence: 1,
  //     },
  //     {
  //       word: ",",
  //       occurrence: 1,
  //     },
  //     {
  //       word: "τῷ",
  //       occurrence: 1,
  //     },
  //     {
  //       word: "κρατίστῳ",
  //       occurrence: 1,
  //     },
  //     {
  //       word: "ἡγεμόνι",
  //       occurrence: 1,
  //     },
  //     {
  //       word: "Φήλικι",
  //       occurrence: 1,
  //     },
  //     {
  //       word: ",",
  //       occurrence: 2,
  //     },
  //     {
  //       word: "χαίρειν",
  //       occurrence: 1,
  //     },
  //   ]

  //   expect(words).toEqual(expected)
  // })

  // test('', () => {
  //   const quote = "τοῦ δοῦναι μετάνοιαν τῷ Ἰσραὴλ καὶ ἄφεσιν ἁμαρτιῶν"
  //   const words = getTestResult('act', 5, 31, quote)
  //   const expected = [
  //     {
  //       word: "τοῦ",
  //       occurrence: 1,
  //     },
  //     {
  //       word: "δοῦναι",
  //       occurrence: 1,
  //     },
  //     {
  //       word: "μετάνοιαν",
  //       occurrence: 1,
  //     },
  //     {
  //       word: "τῷ",
  //       occurrence: 1,
  //     },
  //     {
  //       word: "Ἰσραὴλ",
  //       occurrence: 1,
  //     },
  //     {
  //       word: "καὶ",
  //       occurrence: 2,
  //     },
  //     {
  //       word: "ἄφεσιν",
  //       occurrence: 1,
  //     },
  //     {
  //       word: "ἁμαρτιῶν",
  //       occurrence: 1,
  //     }
  //   ]

  //   expect(words).toEqual(expected)
  // })

  // test('', () => {
  //   const quote = "καὶ ἐτελεύτησεν καὶ ἐτάφη"
  //   const words = getTestResult('act', 2, 29, quote)
  //   const expected = [
  //     {
  //       word: "καὶ",
  //       occurrence: 1,
  //     },
  //     {
  //       word: "ἐτελεύτησεν",
  //       occurrence: 1,
  //     },
  //     {
  //       word: "καὶ",
  //       occurrence: 2,
  //     },
  //     {
  //       word: "ἐτάφη",
  //       occurrence: 1,
  //     },
  //   ]

  //   expect(words).toEqual(expected)
  // })

  // test('', () => {
  //   const quote = "τίμιος παντὶ τῷ λαῷ"
  //   const result = getTestResult('act', 5, 34, quote)
  //   const expected = [
  //     {
  //       word: "τίμιος",
  //       occurrence: 1
  //     },
  //     {
  //       word: "παντὶ",
  //       occurrence: 1
  //     },
  //     {
  //       word: "τῷ",
  //       occurrence: 2
  //     },
  //     {
  //       word: "λαῷ",
  //       occurrence: 1
  //     }
  //   ]

  //   expect(result).toEqual(expected)
  // })

  // test('', () => {
  //   const quote = "πάντες ὅσοι ἐπείθοντο αὐτῷ διελύθησαν"
  //   const result = getTestResult('act', 5, 36, quote)
  //   const expected = [
  //     {
  //       word: "πάντες",
  //       occurrence: 1
  //     },
  //     {
  //       word: "ὅσοι",
  //       occurrence: 1
  //     },
  //     {
  //       word: "ἐπείθοντο",
  //       occurrence: 1
  //     },
  //     {
  //       word: "αὐτῷ",
  //       occurrence: 1
  //     },
  //     {
  //       word: "διελύθησαν",
  //       occurrence: 1
  //     }
  //   ]

  //   expect(result).toEqual(expected)
  // })

  // test('', () => {
  //   const quote = "ἐὰν μὴ οὗτοι μείνωσιν ἐν τῷ πλοίῳ, ὑμεῖς σωθῆναι οὐ δύνασθε"
  //   const result = getTestResult('act', 27, 31, quote)
  //   const expected = [
  //     {
  //       word: "ἐὰν",
  //       occurrence: 1
  //     },
  //     {
  //       word: "μὴ",
  //       occurrence: 1
  //     },
  //     {
  //       word: "οὗτοι",
  //       occurrence: 1
  //     },
  //     {
  //       word: "μείνωσιν",
  //       occurrence: 1
  //     },
  //     {
  //       word: "ἐν",
  //       occurrence: 1
  //     },
  //     {
  //       word: "τῷ",
  //       occurrence: 2
  //     },
  //     {
  //       word: "πλοίῳ",
  //       occurrence: 1
  //     },
  //     {
  //       word: ",",
  //       occurrence: 2
  //     },
  //     {
  //       word: "ὑμεῖς",
  //       occurrence: 1
  //     },
  //     {
  //       word: "σωθῆναι",
  //       occurrence: 1
  //     },
  //     {
  //       word: "οὐ",
  //       occurrence: 1
  //     },
  //     {
  //       word: "δύνασθε",
  //       occurrence: 1
  //     }
  //   ]

  //   expect(result).toEqual(expected)
  // })
})