import styled from '@emotion/native'
import * as Icon from '@expo/vector-icons'
import React, { memo } from 'react'

import Back from '~common/Back'
import Link from '~common/Link'
import Box from '~common/ui/Box'
import Text from '~common/ui/Text'
import { getVersions } from '~helpers/bibleVersions'

const HeaderBox = styled(Box)(({ theme }) => ({
  height: 60,
  alignItems: 'center',
  borderBottomColor: theme.colors.border,
}))

const LinkBox = styled(Link)({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingLeft: 10,
  paddingRight: 10,
  paddingVertical: 15,
})

const FeatherIcon = styled(Icon.Feather)(({ theme }) => ({
  color: theme.colors.default,
}))

const getPrevNextVersions = (versionsArray, version) => {
  const index = versionsArray.findIndex(v => v === version)
  return [versionsArray[index - 1], versionsArray[index + 1]]
}

const Header = ({ hasBackButton, isModal, title, version, setVersion }) => {
  const versionsArray = Object.keys(getVersions())
  const [prevVersion, nextVersion] = getPrevNextVersions(versionsArray, version)
  return (
    <HeaderBox row overflow="visibility">
      <Box justifyContent="center">
        {hasBackButton && (
          <Back padding>
            <FeatherIcon name={isModal ? 'x' : 'arrow-left'} size={20} />
          </Back>
        )}
      </Box>
      <Box center row flex>
        <Box center width={70}>
          {prevVersion && (
            <LinkBox onPress={() => setVersion(prevVersion)}>
              <Text color="tertiary" fontSize={12} bold>
                {prevVersion}
              </Text>
            </LinkBox>
          )}
        </Box>
        <Text fontSize={16} title marginLeft={10} marginRight={10}>
          {title}
        </Text>
        <Box center width={70}>
          {nextVersion && (
            <LinkBox onPress={() => setVersion(nextVersion)}>
              <Text color="tertiary" fontSize={12} bold>
                {nextVersion}
              </Text>
            </LinkBox>
          )}
        </Box>
      </Box>

      <Box width={30} />
    </HeaderBox>
  )
}

export default memo(Header)
