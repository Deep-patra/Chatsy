import Settings from '@/components/Settings'
import Search from '@/components/Search'
import Logout from '../logout'
import CreateGroup from '@/components/CreateGroup'
import AddMember from '@/components/ChatBox/addMember'
import RemoveMember from '@/components/ChatBox/removeMember'
import ImagePreview from '../imagePreview'

export default function Modals() {
  return (
    <>
      {/* Settings Modal */}
      <Settings/>

      {/* Search Modal */}
      <Search/>

      {/* Create Group Modal */}
      <CreateGroup/>

      {/* Add Member Modal */}
      <AddMember/>

      {/* Remove Member Modal */}
      <RemoveMember/>

      {/* Image Preview */}
      <ImagePreview/>

      {/* Logout Modal */}
      <Logout/>
    </>
  )
} 
