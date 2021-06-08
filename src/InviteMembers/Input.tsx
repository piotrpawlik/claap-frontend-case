import { useEffect, useState } from 'react'
import { useCombobox, useMultipleSelection } from 'downshift'
import {
  Wrap,
  List,
  ListItem,
  useBoolean,
  Tooltip,
  Flex,
  Box,
  HStack,
  WrapItem,
} from '@chakra-ui/react'
import './Input.css'
import { searchUser, normalize } from './searchUsers'
import compact from 'lodash/compact'
import { User, KnownUser, UnknownUser } from './types'
import { SelectedItem } from './SelectedItem'

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

const notAlreadySelected = (selectedUsers: User[], email: string): boolean =>
  !selectedUsers.map((user) => user.email).includes(email)

const formatUser = (user: User) => user.email || user.firstName

interface ChildrenProps {
  selectedItems: User[]
  resetInput: () => void
}

interface InviteMembersInputProps {
  children: ({ selectedItems, resetInput }: ChildrenProps) => React.ReactNode
}

export const InviteMembersInput = ({ children }: InviteMembersInputProps) => {
  const [inputValue, setInputValue] = useState('')
  const [searchedUsers, setSearchedUsers] = useState<KnownUser[]>([])
  const [unknownUser, setUnkownUser] = useState<UnknownUser>(null)
  const {
    getSelectedItemProps,
    getDropdownProps,
    addSelectedItem,
    removeSelectedItem,
    selectedItems,
    reset,
  } = useMultipleSelection<User>()
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
    items: compact([unknownUser, ...searchedUsers]),
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
            setSearchedUsers([])
            addSelectedItem(selectedItem)
          }

          break
        default:
          break
      }
    },
  })
  const [loading, setLoading] = useBoolean(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (error) {
      setError(null)
    }

    const regexp = /(.+)@(.+){2,}\.(.+){2,}/
    const normalizedPossibleEmail = normalize(inputValue)

    if (
      normalizedPossibleEmail.match(regexp) &&
      notAlreadySelected(selectedItems, normalizedPossibleEmail)
    ) {
      setUnkownUser({ email: normalizedPossibleEmail })
    } else {
      setUnkownUser(null)
    }
  }, [inputValue])

  useEffect(() => {
    if (inputValue.match(/.*@.*/)) {
      return
    }

    setLoading.on()
    searchUser(inputValue)
      .then((users) => {
        setSearchedUsers(
          users.filter((user) => notAlreadySelected(selectedItems, user.email))
        )
      })
      .then(() => {
        setLoading.off()
      })
      .catch(() => {
        setError('Error getting list of known users. Please try again.')
      })
  }, [inputValue])

  return (
    <div>
      {/* <div style={comboboxWrapperStyles}> */}
      <Flex align="center">
        <Flex {...getComboboxProps()} grow={1}>
          <Flex wrap="wrap" border="1px" p={1}>
            {selectedItems.map((selectedItem, index) => (
              <SelectedItem
                key={`selected-item-${index}`}
                label={formatUser(selectedItem)}
                type={selectedItem.firstName ? 'user' : 'email'}
                onRemoveClick={() => removeSelectedItem(selectedItem)}
                {...getSelectedItemProps({ selectedItem, index })}
              />
            ))}
            <Tooltip
              label={error}
              isOpen={error}
              placement="top"
              hasArrow
              colorScheme="red"
            >
              <span>
                <input
                  {...getInputProps(
                    getDropdownProps({ preventKeyAction: isOpen })
                  )}
                />
              </span>
            </Tooltip>
          </Flex>
        </Flex>
        <Box ml={5}>{children({ selectedItems, resetInput: reset })}</Box>
      </Flex>
      {isOpen && (
        <List {...getMenuProps()}>
          {loading ? <ListItem>loading...</ListItem> : null}
          {unknownUser ? (
            <ListItem
              style={
                highlightedIndex === 0 ? { backgroundColor: '#bde4ff' } : {}
              }
              {...getItemProps({ item: unknownUser, index: 0 })}
            >
              {unknownUser.email}
            </ListItem>
          ) : null}
          {searchedUsers &&
            searchedUsers.map((item, index) => (
              <ListItem
                style={
                  highlightedIndex === index
                    ? { backgroundColor: '#bde4ff' }
                    : {}
                }
                key={`${item.id}${index}`}
                {...getItemProps({ item, index })}
              >
                {item.firstName}
              </ListItem>
            ))}
        </List>
      )}
    </div>
  )
}
