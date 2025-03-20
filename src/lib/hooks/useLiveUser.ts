import { useAuth } from "@/components/auth-provider"
import { useQuery } from "@tanstack/react-query"
import { getLiveUserQuery } from "../queries"

export const useLiveUser = () => {
    const { user } = useAuth()
    const { data: liveUser } = useQuery(getLiveUserQuery(user))
    return liveUser
}