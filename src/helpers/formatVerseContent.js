import books from '~assets/bible_versions/books-desc'
import i18n from '~i18n'

export default verses => {
  verses = verses.filter(v => v)
  if (!verses.length) {
    return { title: '', content: '' }
  }

  verses = verses.map(v => {
    if (typeof v === 'string') {
      const [Livre, Chapitre, Verset] = v.split('-')
      return { Livre, Chapitre, Verset }
    }
    return v
  })

  const content: string = verses.map(v => `${v.Texte}`).join(' ')

  const title: string = verses
    .map(v => Number(v.Verset))
    .reduce((acc, v, i, array) => {
      if (v === array[i - 1] + 1 && v === array[i + 1] - 1) {
        // if suite > 2
        return acc
      }
      if (v === array[i - 1] + 1 && v !== array[i + 1] - 1) {
        // if endSuite
        return `${acc}-${v}`
      }
      if (array[i - 1] && v - 1 !== array[i - 1]) {
        // if not preceded by - 1
        return `${acc},${v}`
      }
      return acc + v
    }, `${i18n.t(books[Number(verses[0].Livre) - 1]?.Nom)} ${verses[0].Chapitre}:`)

  return { title, content }
}
