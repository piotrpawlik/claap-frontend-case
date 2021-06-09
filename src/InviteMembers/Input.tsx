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
} from '@chakra-ui/react'
import './Input.css'
import compact from 'lodash/compact'
import { User } from './types'
import { SelectedItem } from './SelectedItem'
import { useMeasure } from 'react-use'
import { useGetInvitee } from './useGetInvitee'

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
                  type={selectedItem.firstName ? 'user' : 'email'}
                  onRemoveClick={() => removeSelectedItem(selectedItem)}
                  {...getSelectedItemProps({ selectedItem, index })}
                />
              </WrapItem>
            ))}
            <WrapItem flexGrow={1}>
              <Tooltip
                label={error}
                isOpen={error}
                placement="top"
                hasArrow
                colorScheme="red"
              >
                <Flex grow={1}>
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
                </Flex>
              </Tooltip>
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
                bg={highlightedIndex === 0 && 'red.100'}
                key={index}
                {...getItemProps({ item, index })}
              >
                {formatUser(item)}
              </ListItem>
            ))}
            {isLoading ? <ListItem>loading...</ListItem> : null}
          </List>
        )}
      </Box>
    </div>
  )
}
