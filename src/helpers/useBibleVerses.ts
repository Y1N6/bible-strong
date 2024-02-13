import { useAtom } from 'jotai/react'
import React from 'react'
import { Verse } from '~common/types'
import loadBible from '~helpers/loadBible'
import { defaultBibleAtom } from '../state/tabs'

export const verseStringToObject = (
  arrayString: string[]
): Omit<Verse, 'Texte'>[] => {
  return arrayString.map(string => {
    const [Livre, Chapitre, Verset] = string.split('-')
    return { Livre, Chapitre, Verset }
  })
}

const useBibleVerses = (verseIds: Omit<Verse, 'Texte'>[]) => {
  const [verses, setVerses] = React.useState<Verse[]>([])

  const [bible] = useAtom(defaultBibleAtom)
  const { selectedVersion: version } = bible.data

  React.useEffect(() => {
    const loadVerses = async () => {
      const { Livre, Chapitre } = verseIds[0]
      const response = await loadBible(version)
      const versesByChapter = response[Livre][Chapitre]
      const versesWithText = Object.keys(versesByChapter)
        .map((v: string) => ({
          Verset: Number(v),
          Texte: versesByChapter[v] as string,
          Livre: Number(Livre),
          Chapitre: Number(Chapitre),
        }))
        .filter(v =>
          verseIds.find(vI => Number(vI.Verset) === Number(v.Verset))
        )
      setVerses(versesWithText)
    }
    loadVerses()
  }, [verseIds, version])

  return verses
}

export default useBibleVerses
