import { useState } from 'react'
import { useCombobox, useMultipleSelection } from 'downshift'
import { Wrap, List, ListItem } from '@chakra-ui/react'
import './Input.css'
import { searchUser, normalize } from './searchUsers'

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
  const [filteredItems, setFilteredItems] = useState([])
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
    items: filteredItems,
    inputValue,
    onStateChange: async ({ inputValue, type, selectedItem }) => {
      switch (type) {
        case useCombobox.stateChangeTypes.InputChange:
          const regexp = /(.+)@(.+){2,}\.(.+){2,}/
          const normalizedInputValue = normalize(inputValue)

          if (
            normalizedInputValue.match(regexp) &&
            !selectedItems.includes(normalizedInputValue)
          ) {
            setFilteredItems([{ email: normalizedInputValue }])
          } else {
            setFilteredItems([])
          }

          setInputValue(inputValue)

          break
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          if (selectedItem) {
            setInputValue('')
            addSelectedItem(selectedItem.email)
            selectItem(null)
            setFilteredItems([])
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
                {selectedItem}
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
          {filteredItems.map((item, index) => (
            <ListItem
              style={
                highlightedIndex === index ? { backgroundColor: '#bde4ff' } : {}
              }
              key={`${item.id}${index}`}
              {...getItemProps({ item, index })}
            >
              {item.email}
            </ListItem>
          ))}
        </List>
      )}
    </div>
  )
}
