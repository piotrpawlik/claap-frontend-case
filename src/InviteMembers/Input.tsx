import { useState } from 'react'
import { useCombobox, useMultipleSelection } from 'downshift'
import {
  List,
  ListItem,
  Tooltip,
  Flex,
  Box,
  Wrap,
  WrapItem,
  Spinner,
  HStack,
} from '@chakra-ui/react'
import './Input.css'
import { User } from './types'
import { SelectedItem } from './SelectedItem'
import { useMeasure } from 'react-use'
import { useGetInvitee } from './useGetInvitee'
import { InviteeIcon } from './InviteeIcon'

const formatUser = (user: User) => user['firstName'] || user.email

const inputAccentColor = 'red.400'

interface ChildrenProps {
  selectedItems: User[]
  resetInput: () => void
}

interface InviteMembersInputProps {
  children: ({ selectedItems, resetInput }: ChildrenProps) => React.ReactNode
  onSubmit: any
}

export const InviteMembersInput = ({
  children,
  onSubmit,
}: InviteMembersInputProps) => {
  const [inputValue, setInputValue] = useState('')
  const {
    getSelectedItemProps,
    getDropdownProps,
    addSelectedItem,
    removeSelectedItem,
    selectedItems,
    reset,
  } = useMultipleSelection<User>()
  const { users, isLoading, error } = useGetInvitee({
    inputValue,
    selectedItems,
  })
  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    selectItem,
  } = useCombobox({
    itemToString: (item) => (item ? formatUser(item) : ''),
    items: users,
    inputValue,
    onStateChange: ({ inputValue, type, selectedItem }) => {
      switch (type) {
        case useCombobox.stateChangeTypes.InputChange:
          setInputValue(inputValue)

          break
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          if (selectedItem) {
            setInputValue('')
            selectItem(null)
            addSelectedItem(selectedItem)
          }

          break
        default:
          break
      }
    },
  })
  const [inputRef, { width: menuWidth }] = useMeasure()

  return (
    <div>
      <Flex align="center">
        <Flex
          {...getComboboxProps()}
          grow={1}
          bg="gray.900"
          borderRadius="md"
          ref={inputRef}
          alignSelf="stretch"
        >
          <Wrap p={1} width="100%">
            {selectedItems.map((selectedItem, index) => (
              <WrapItem key={index}>
                <SelectedItem
                  key={`selected-item-${index}`}
                  label={formatUser(selectedItem)}
                  user={selectedItem}
                  onRemoveClick={() => removeSelectedItem(selectedItem)}
                  color={inputAccentColor}
                  {...getSelectedItemProps({ selectedItem, index })}
                />
              </WrapItem>
            ))}
            <WrapItem flexGrow={1} key="input">
              <Flex grow={1}>
                <Tooltip
                  label={error}
                  isOpen={error}
                  placement="top"
                  hasArrow
                  bg="red.400"
                >
                  <input
                    tabIndex={1}
                    {...getInputProps(
                      getDropdownProps({ preventKeyAction: isOpen })
                    )}
                    placeholder={
                      selectedItems.length === 0
                        ? 'Search names or emails...'
                        : null
                    }
                    style={{
                      height: 30,
                      width: '100%',
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        if (selectedItems.length > 0) {
                          onSubmit(selectedItems)
                        }
                      }
                    }}
                    data-testid="invite-input"
                  />
                </Tooltip>
              </Flex>
            </WrapItem>
          </Wrap>
        </Flex>
        <Box ml={5}>{children({ selectedItems, resetInput: reset })}</Box>
      </Flex>
      <Box>
        {isOpen && (
          <List
            {...getMenuProps()}
            bg="gray.900"
            mt={1}
            position="absolute"
            style={{ width: menuWidth }}
          >
            {isLoading ? (
              <ListItem p={5}>
                <HStack>
                  <Spinner />
                  <Box>loading</Box>
                </HStack>
              </ListItem>
            ) : (
              <>
                {users.map((item, index) => (
                  <ListItem
                    bg={highlightedIndex === index && 'gray.600'}
                    key={index}
                    p={5}
                    {...getItemProps({ item, index })}
                  >
                    <HStack>
                      <InviteeIcon user={item} color={inputAccentColor} />
                      <Box
                        color={inputAccentColor}
                        data-testid={`list-item-${index}`}
                      >
                        {formatUser(item)}
                      </Box>
                    </HStack>
                  </ListItem>
                ))}
              </>
            )}
          </List>
        )}
      </Box>
    </div>
  )
}
