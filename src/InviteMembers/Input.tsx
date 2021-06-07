import { useEffect, useState } from 'react'
import { useCombobox, useMultipleSelection } from 'downshift'
import { Wrap, List, ListItem } from '@chakra-ui/react'
import './Input.css'
import { searchUser, normalize } from './searchUsers'
import compact from 'lodash/compact'
import { User, KnownUser, UnknownUser } from './types'

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

export const comboboxStyles = { display: 'inline-block', marginLeft: '5px' }

const notAlreadySelected = (selectedUsers: User[], email: string): boolean =>
  !selectedUsers.map((user) => user.email).includes(email)

const formatUser = (user: User) => user.email || user.firstName

export const InviteMembersInput = () => {
  const [inputValue, setInputValue] = useState('')
  const [searchedUsers, setSearchedUsers] = useState<KnownUser[]>([])
  const [unknownUser, setUnkownUser] = useState<UnknownUser>(null)
  const {
    getSelectedItemProps,
    getDropdownProps,
    addSelectedItem,
    removeSelectedItem,
    selectedItems,
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

  useEffect(() => {
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
  }, [inputValue, selectedItems])

  useEffect(() => {
    searchUser(inputValue).then((users) => {
      setSearchedUsers(
        users.filter((user) => notAlreadySelected(selectedItems, user.email))
      )
    })
  }, [inputValue, selectedItems])

  return (
    <div>
      {/* <div style={comboboxWrapperStyles}> */}
      <div>
        <div style={comboboxStyles} {...getComboboxProps()}>
          <Wrap style={{ border: '1px solid black' }}>
            {selectedItems.map((selectedItem, index) => (
              <span
                // style={selectedItemStyles}
                key={`selected-item-${index}`}
                {...getSelectedItemProps({ selectedItem, index })}
              >
                {formatUser(selectedItem)}
                <span
                  // style={selectedItemIconStyles}
                  onClick={() => removeSelectedItem(selectedItem)}
                >
                  &#10005;
                </span>
              </span>
            ))}
            <input
              {...getInputProps(getDropdownProps({ preventKeyAction: isOpen }))}
            ></input>
          </Wrap>
        </div>
      </div>
      {isOpen && (
        <List {...getMenuProps()}>
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
