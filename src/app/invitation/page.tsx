import { checkInvitation, acceptInvitation, declineInvitation } from '@/actions/invitation'

type Props = {
  searchParams: {
    token?: string
  }
}

export default async function InvitationPage({ searchParams }: Props) {
  const token = searchParams.token

  if (!token) {
    return <div>Invalid invitation link.</div>
  }

  const invitation = await checkInvitation(token)

  if (!invitation) {
    return <div>Invitation not found or expired.</div>
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-xl font-bold mb-4">You&apos;re invited to join:</h1>
      <p className="mb-2">
        <strong>Project:</strong> {invitation.projectName}
      </p>
      <p className="mb-4">
        <strong>Invited by:</strong> {invitation.inviterEmail}
      </p>

      <form action={acceptInvitation} className="space-x-4">
        <input type="hidden" name="token" value={token} />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Accept
        </button>
      </form>

      <form action={declineInvitation} className="mt-4">
        <input type="hidden" name="token" value={token} />
        <button
          type="submit"
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Decline
        </button>
      </form>
    </div>
  )
}
