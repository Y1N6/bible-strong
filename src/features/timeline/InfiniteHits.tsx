import React from 'react'
import {
  connectInfiniteHits,
  connectStateResults,
} from 'react-instantsearch-native'
import FlatList from '~common/ui/FlatList'

import Box from '~common/ui/Box'
import Highlight from './Highlight'
import Snippet from './Snippet'
import Border from '~common/ui/Border'

const InfiniteHits = ({
  searchValue,
  hits,
  hasMore,
  refine,
  allSearchResults,
  error,
  searching,
  ...props
}) => {
  return (
    <Box flex>
      <FlatList
        data={hits}
        keyExtractor={item => item.objectID}
        onEndReached={() => {
          hasMore && refine()
        }}
        renderItem={({ item }) => (
          <Box>
            <Highlight attribute="title" hit={item} />
            <Snippet attribute="description" hit={item} />
            <Snippet attribute="article" hit={item} />
            <Border />
          </Box>
        )}
      />
    </Box>
  )
}

export default connectInfiniteHits(connectStateResults(InfiniteHits))
