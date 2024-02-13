import styled from '@emotion/native'
import * as Icon from '@expo/vector-icons'
import React, { memo } from 'react'

import { useTranslation } from 'react-i18next'
import Header from '~common/Header'
import Link from '~common/Link'
import PopOverMenu from '~common/PopOverMenu'
import Box from '~common/ui/Box'
import { FeatherIcon } from '~common/ui/Icon'
import MenuOption from '~common/ui/MenuOption'
import Text from '~common/ui/Text'
import { useOpenInNewTab } from '~features/app-switcher/utils/useOpenInNewTab'

const HeaderBox = styled(Box)({
  alignItems: 'center',
  paddingLeft: 15,
  paddingRight: 15,
})

const ValidateIcon = styled(Icon.Feather)(({ theme }) => ({
  color: theme.colors.success,
}))

const EditHeader = ({
  isReadOnly,
  setReadOnly,
  title,
  setTitlePrompt,
  hasBackButton = true,
  study,
}) => {
  const openInNewTab = useOpenInNewTab()
  const { t } = useTranslation()

  if (isReadOnly) {
    return (
      <Header
        title={title}
        onTitlePress={setTitlePrompt}
        hasBackButton={hasBackButton}
        rightComponent={
          <PopOverMenu
            popover={
              <>
                <MenuOption
                  onSelect={() => {
                    openInNewTab(
                      {
                        id: `study-${Date.now()}`,
                        title: study.title,
                        isRemovable: true,
                        type: 'study',
                        data: {
                          studyId: study.id,
                        },
                      },
                      { autoRedirect: true }
                    )
                  }}
                >
                  <Box row alignItems="center">
                    <FeatherIcon name="external-link" size={15} />
                    <Text marginLeft={10}>{t('tab.openInNewTab')}</Text>
                  </Box>
                </MenuOption>
              </>
            }
          />
        }
      />
    )
  }

  return (
    <HeaderBox>
      <Box row height={50} center>
        <Box flex justifyContent="center">
          <Link
            onPress={setReadOnly}
            underlayColor="transparent"
            style={{ marginRight: 15 }}
          >
            <ValidateIcon name="check" size={25} />
          </Link>
        </Box>
      </Box>
    </HeaderBox>
  )
}

export default memo(EditHeader)
