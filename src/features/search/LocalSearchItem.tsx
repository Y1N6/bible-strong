import styled from '@emotion/native'
import React from 'react'
import Paragraph from '~common/ui/Paragraph'
import Text from '~common/ui/Text'

const Container = styled.TouchableOpacity(({ theme }) => ({
  paddingTop: 15,
  paddingBottom: 20,
  borderBottomWidth: 1,
  borderBottomColor: theme.colors.border,
}))

const formatText = (sentence, array) => {
  return array.reduce(
    ({ offset, result, phrase }, [position, range], i) => {
      const before = phrase.substr(0, position - offset)
      const highlighted = (
        <Text bold color="primary" key={i}>
          {phrase.substr(position - offset, range)}
        </Text>
      )
      const rest = phrase.substr(position + range - offset, phrase.length)

      result.push(before, highlighted)
      if (array.length - 1 === i) {
        result.push(rest)
      }

      offset = position + range
      phrase = rest

      return { offset, result, phrase }
    },
    { offset: 0, phrase: sentence, result: [] }
  )
}

const LocalSearchItem = ({ reference, text, positions, onPress }) => {
  const { result } = positions.length
    ? formatText(text, positions)
    : { result: text }
  return (
    <Container onPress={onPress}>
      <Text title fontSize={16} marginBottom={5}>
        {reference}
      </Text>
      <Paragraph small>{result}</Paragraph>
    </Container>
  )
}

export default LocalSearchItem
