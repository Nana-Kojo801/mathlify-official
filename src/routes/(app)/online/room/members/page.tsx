import PageHeader from "@/components/page-header";
import UserList from "@/components/users-list";
import { useOutletContext } from "react-router";
import { OutletContext } from "../_types";

const MembersPage = () => {
  const { room } = useOutletContext<OutletContext>();
  return (
    <>
      <PageHeader title="Members" />
      <div className="p-4 space-y-3">
        <UserList
          list={room.members.map((member) => member.user)}
        />
      </div>
    </>
  );
};

export default MembersPage;
