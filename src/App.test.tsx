import { render, screen, fireEvent, within } from '@testing-library/react'
import App from './App'

test('cta button is there', () => {
  render(<App />)
  const linkElement = screen.getByText('Invite teammates')
  expect(linkElement).toBeInTheDocument()
})

test('able to open the modal', () => {
  render(<App />)
  const linkElement = screen.getByText('Invite teammates')
  fireEvent.click(linkElement)
  const modalText = screen.getByText(
    'Send members an email invitation to join this workspace'
  )
  expect(modalText).toBeInTheDocument()
})

test('inviting known team member', async () => {
  render(<App />)
  fireEvent.click(screen.getByText('Invite teammates'))
  const input = screen.getByTestId('invite-input')
  expect(input).toBeInTheDocument()
  fireEvent.change(input, { target: { value: 't' } })
  const menuItem = await screen.findByText('Tara')
  fireEvent.click(menuItem)
  const inviteButton = screen.getByText('Invite')
  fireEvent.click(inviteButton)
  const result = within(screen.getByTestId('invite-result')).getByText(
    /tara@claap.io/
  )
  expect(result).toBeInTheDocument()
})

test('inviting unknown user', async () => {
  const email = 'g@example.com'

  render(<App />)
  fireEvent.click(screen.getByText('Invite teammates'))
  const input = screen.getByTestId('invite-input')
  expect(input).toBeInTheDocument()
  fireEvent.change(input, { target: { value: email } })
  const listItem = await screen.findByTestId('list-item-0')
  const menuItem = await within(listItem).findByText(email)
  fireEvent.click(menuItem)
  const inviteButton = screen.getByText('Invite')
  fireEvent.click(inviteButton)
  const result = within(screen.getByTestId('invite-result')).getByText(
    new RegExp(email)
  )
  expect(result).toBeInTheDocument()
})
