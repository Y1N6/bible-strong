import * as FileSystem from 'expo-file-system'
import React, { useEffect } from 'react'

import * as Sentry from '@sentry/react-native'
import { useTranslation } from 'react-i18next'
import DownloadRequired from '~common/DownloadRequired'
import Loading from '~common/Loading'
import SnackBar from '~common/SnackBar'
import { existsAssets, unzipAssets } from '~helpers/assetUtils'
import { strongDB } from '~helpers/database'
import { useDBStateValue } from '~helpers/databaseState'
import { getDatabasesRef } from '~helpers/firebase'
import { getLangIsFr } from '~i18n'
import Box from './ui/Box'
import Progress from './ui/Progress'

const RNFS = require('react-native-fs')
const STRONG_FILE_SIZE = 34941952

const useStrongZip = (dispatch: any, startDownload: any) => {
  useEffect(() => {
    if (!getLangIsFr()) {
      return
    }

    if (strongDB.get()) {
      dispatch({
        type: 'strong.setLoading',
        payload: false,
      })
    } else {
      const loadDBAsync = async () => {
        const sqliteDirPath = `${RNFS.DocumentDirectoryPath}/SQLite`
        const sqliteDirExists = await RNFS.exists(sqliteDirPath)

        const dbPath = `${sqliteDirPath}/strong.sqlite`
        const dbFileExists = await RNFS.exists(dbPath)

        const sqliteZipExists = await existsAssets('www/strong.sqlite.zip')

        if (!dbFileExists) {
          if (sqliteZipExists && !(window as any).strongDownloadHasStarted) {
            ;(window as any).strongDownloadHasStarted = true

            if (!sqliteDirExists) {
              await RNFS.mkdir(sqliteDirPath)
            }

            await unzipAssets('www/strong.sqlite.zip', sqliteDirPath)

            await strongDB.init()

            dispatch({
              type: 'strong.setLoading',
              payload: false,
            })
            ;(window as any).strongDownloadHasStarted = false
          } else {
            // Grosse erreur impossible de continuer
          }
        } else {
          await strongDB.init()

          dispatch({
            type: 'strong.setLoading',
            payload: false,
          })
        }
      }

      loadDBAsync()
    }
  }, [dispatch, startDownload])
}

const useStrongEn = (dispatch: any, startDownload: any) => {
  const { t } = useTranslation()
  useEffect(() => {
    if (strongDB.get()) {
      dispatch({
        type: 'strong.setLoading',
        payload: false,
      })
    } else {
      const loadDBAsync = async () => {
        const sqliteDirPath = `${FileSystem.documentDirectory}SQLite`
        const sqliteDir = await FileSystem.getInfoAsync(sqliteDirPath)

        const dbPath = `${sqliteDirPath}/strong.sqlite`
        const dbFile = await FileSystem.getInfoAsync(dbPath)

        if (!dbFile.exists) {
          if (!sqliteDir.exists) {
            await FileSystem.makeDirectoryAsync(sqliteDirPath)
          } else if (!sqliteDir.isDirectory) {
            throw new Error('SQLite dir is not a directory')
          }

          // Waiting for user to accept to download
          if (!startDownload) {
            dispatch({
              type: 'strong.setProposeDownload',
              payload: true,
            })
            return
          }

          try {
            if (!(window as any).strongDownloadHasStarted) {
              ;(window as any).strongDownloadHasStarted = true

              const sqliteDbUri = getDatabasesRef().STRONG

              console.log(`Downloading ${sqliteDbUri} to ${dbPath}`)

              if (!sqliteDir.exists) {
                await FileSystem.makeDirectoryAsync(sqliteDirPath)
              } else if (!sqliteDir.isDirectory) {
                throw new Error('SQLite dir is not a directory')
              }

              await FileSystem.createDownloadResumable(
                sqliteDbUri,
                dbPath,
                undefined,
                ({ totalBytesWritten }) => {
                  const idxProgress =
                    Math.floor((totalBytesWritten / STRONG_FILE_SIZE) * 100) /
                    100
                  dispatch({
                    type: 'strong.setProgress',
                    payload: idxProgress,
                  })
                }
              ).downloadAsync()

              await strongDB.init()

              dispatch({
                type: 'strong.setLoading',
                payload: false,
              })
              ;(window as any).strongDownloadHasStarted = false
            }
          } catch (e) {
            console.log(e)
            SnackBar.show(
              t(
                "Impossible de commencer le téléchargement. Assurez-vous d'être connecté à internet."
              ),
              'danger'
            )
            Sentry.captureException(e)
            dispatch({
              type: 'strong.setProposeDownload',
              payload: true,
            })
            dispatch({
              type: 'strong.setStartDownload',
              payload: false,
            })
          }
        } else {
          await strongDB.init()

          dispatch({
            type: 'strong.setLoading',
            payload: false,
          })
        }
      }

      loadDBAsync()
    }
  }, [dispatch, startDownload])
}

export const useWaitForDatabase = () => {
  const [
    {
      strong: { isLoading, proposeDownload, startDownload, progress },
    },
    dispatch,
  ] = useDBStateValue()

  // useStrongZip(dispatch, startDownload)
  useStrongEn(dispatch, startDownload)

  const setStartDownload = (value: boolean) => {
    dispatch({
      type: 'strong.setStartDownload',
      payload: value,
    })
  }

  return {
    isLoading,
    progress,
    proposeDownload,
    startDownload,
    setStartDownload,
  }
}

const waitForDatabase = ({
  hasBackButton,
  hasHeader,
  size,
}: {
  hasBackButton?: boolean
  size?: 'small' | 'large'
  hasHeader?: boolean
} = {}) => <T,>(
  WrappedComponent: React.ComponentType<T>
): React.ComponentType<T> => (props: any) => {
  const { t } = useTranslation()
  const {
    isLoading,
    progress,
    proposeDownload,
    startDownload,
    setStartDownload,
  } = useWaitForDatabase()

  if (isLoading && startDownload) {
    return (
      <Box h={300} alignItems="center">
        <Loading message={t('Téléchargement de la base strong...')}>
          <Progress progress={progress} />
        </Loading>
      </Box>
    )
  }

  if (isLoading && proposeDownload) {
    return (
      <DownloadRequired
        hasBackButton={hasBackButton}
        size={size}
        hasHeader={hasHeader}
        title={t(
          'La base de données strong est requise pour accéder à cette page.'
        )}
        setStartDownload={setStartDownload}
        fileSize={35}
      />
    )
  }

  if (isLoading) {
    return (
      <Loading
        message={t('Chargement de la base strong...')}
        subMessage="Merci de patienter, la première fois peut prendre plusieurs secondes... Si au bout de 30s il ne se passe rien, n'hésitez pas à redémarrer l'app."
      />
    )
  }

  return <WrappedComponent {...props} />
}

export default waitForDatabase
