import { useEffect, useState } from 'react'
import { useCombobox, useMultipleSelection } from 'downshift'
import { Wrap, List, ListItem } from '@chakra-ui/react'
import './Input.css'
import { searchUser, normalize, User } from './searchUsers'
import compact from 'lodash/compact'
import isString from 'lodash/isString'

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

const filterAlreadySelected = (selectedEmails) => (users) =>
  users.filter((user) => !selectedEmails.includes(user.email))

export const InviteMembersInput = () => {
  const [inputValue, setInputValue] = useState('')
  const [searchedItems, setSearchedItems] = useState([])
  const [typedEmail, setTypedEmail] = useState(null)

  useEffect(() => {
    const regexp = /(.+)@(.+){2,}\.(.+){2,}/
    const normalizedInputValue = normalize(inputValue)

    if (normalizedInputValue.match(regexp)) {
      setTypedEmail(normalizedInputValue)
    } else {
      setTypedEmail(null)
    }
  }, [inputValue])

  useEffect(() => {
    searchUser(inputValue).then(setSearchedItems)
  }, [inputValue])

  const {
    getSelectedItemProps,
    getDropdownProps,
    addSelectedItem,
    removeSelectedItem,
    selectedItems,
  } = useMultipleSelection()
  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    selectItem,
  } = useCombobox({
    itemToString: (item) => {
      if (!item) return ''
      return isString(item) ? item : (item as User).firstName
    },
    items: compact([typedEmail, ...searchedItems]),
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
            setSearchedItems([])
            addSelectedItem(selectedItem)
          }

          break
        default:
          break
      }
    },
  })

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
                {selectedItem['email'] || selectedItem}
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
          {typedEmail ? (
            <ListItem
              style={
                highlightedIndex === 0 ? { backgroundColor: '#bde4ff' } : {}
              }
              {...getItemProps({ item: typedEmail, index: 0 })}
            >
              {typedEmail}
            </ListItem>
          ) : null}
          {searchedItems &&
            searchedItems.map((item, index) => (
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
