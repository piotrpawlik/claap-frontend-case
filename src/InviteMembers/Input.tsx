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

export const menuStyles = {
  maxHeight: '180px',
  overflowY: 'auto',
  margin: 0,
  borderTop: 0,
  background: 'white',
  position: 'absolute',
  zIndex: 1000,
  listStyle: 'none',
  padding: 0,
  left: '185px',
  minWidth: '200px',
}

const formatUser = (user: User) => user['firstName'] || user.email

const inputAccentColor = 'red.400'

interface ChildrenProps {
  selectedItems: User[]
  resetInput: () => void
}

interface InviteMembersInputProps {
  children: ({ selectedItems, resetInput }: ChildrenProps) => React.ReactNode
}

export const InviteMembersInput = ({ children }: InviteMembersInputProps) => {
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
              <WrapItem>
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
            <WrapItem flexGrow={1}>
              <Flex grow={1}>
                <Tooltip
                  label={error}
                  isOpen={error}
                  placement="top"
                  hasArrow
                  bg="red.400"
                >
                  <input
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
                      width: selectedItems.length === 0 ? '100%' : 100,
                    }}
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
            {users.map((item, index) => (
              <ListItem
                bg={highlightedIndex === 0 && 'gray.600'}
                key={index}
                p={5}
                {...getItemProps({ item, index })}
              >
                <HStack>
                  <InviteeIcon user={item} color={inputAccentColor} />
                  <Box color={inputAccentColor}>{formatUser(item)}</Box>
                </HStack>
              </ListItem>
            ))}
            {isLoading ? (
              <ListItem p={5}>
                <HStack>
                  <Spinner />
                  <Box>loading</Box>
                </HStack>
              </ListItem>
            ) : null}
          </List>
        )}
      </Box>
    </div>
  )
}
