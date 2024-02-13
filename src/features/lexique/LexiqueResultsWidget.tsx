import React, { useState, useEffect } from 'react'
import { LinearGradient } from 'expo-linear-gradient'

import Link from '~common/Link'
import Box from '~common/ui/Box'
import Text from '~common/ui/Text'
import loadLexiqueBySearch from '~helpers/loadLexiqueBySearch'
import { useWaitForDatabase } from '~common/waitForStrongDB'

import { useResultsByLetterOrSearch } from './useUtilities'
import LexiqueResultItem from './LexiqueResultItem'

const hideIfNoDatabase = WrappedComponent => props => {
  const { isLoading, proposeDownload } = useWaitForDatabase()

  if (isLoading || proposeDownload) {
    return null
  }
  return <WrappedComponent {...props} />
}

const LIMIT = 5
const height = 40

const LexiqueResultsWidget = ({ searchValue }) => {
  const [error, setError] = useState(false)
  const [limit, setLimit] = useState(LIMIT)

  const { results, isLoading } = useResultsByLetterOrSearch({
    query: loadLexiqueBySearch,
    value: searchValue,
  })

  useEffect(() => {
    if (results.error) {
      setError(results.error)
    }
  }, [results])

  if (error) {
    return null
  }

  if (!results.length) {
    return null
  }

  return (
    <>
      {results.slice(0, limit).map(strong => {
        const { Grec, Mot, Code } = strong
        const variant = Grec ? 'grec' : 'hebreu'
        return (
          <LexiqueResultItem
            key={Code + Mot}
            id={Code}
            title={Mot}
            variant={variant}
          />
        )
      })}
      {results.length > limit && (
        <Link onPress={() => setLimit(l => l + 5)}>
          <Box
            opacity={0.5}
            center
            rounded
            marginRight={10}
            marginBottom={10}
            height={height}
            paddingHorizontal={10}
          >
            <Box
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                height,
                borderRadius: 3,
              }}
            >
              <LinearGradient
                start={[0.1, 0.2]}
                style={{ height }}
                colors={['rgba(248,131,121,1)', 'rgba(255,77,93,1)']}
              />
            </Box>
            <Text title fontSize={14} style={{ color: 'white' }}>
              + {results.length - limit}
            </Text>
          </Box>
        </Link>
      )}
    </>
  )
}

export default hideIfNoDatabase(LexiqueResultsWidget)
