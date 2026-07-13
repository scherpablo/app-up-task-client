import { isAxiosError } from "axios"
import api from "@/lib/axios"
import { notificationsSchema, unreadCountsSchema } from "../types"

export async function getUnreadCounts() {
    try {
        const url = '/projects/notifications/unread-counts'
        const { data } = await api(url)
        const response = unreadCountsSchema.safeParse(data)
        if(response.success) {
            return response.data
        }
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function getProjectNotifications(projectId: string) {
    try {
        const url = `/projects/${projectId}/notifications`
        const { data } = await api(url)
        const response = notificationsSchema.safeParse(data)
        if(response.success) {
            return response.data
        }
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function markNotificationAsRead({projectId, notificationId} : {projectId: string, notificationId: string}) {
    try {
        const url = `/projects/${projectId}/notifications/${notificationId}/read`
        const { data } = await api.post<string>(url)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}