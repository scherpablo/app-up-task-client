import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { BellIcon } from '@heroicons/react/20/solid'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { getProjectNotifications, markNotificationAsRead } from '@/api/NotificationAPI'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

type NotificationBellProps = {
    projectId: string
    unreadCount: number
}

export default function NotificationBell({ projectId, unreadCount }: NotificationBellProps) {

    const queryClient = useQueryClient()

    const { data: notifications } = useQuery({
        queryKey: ['notifications', projectId],
        queryFn: () => getProjectNotifications(projectId),
        enabled: false
    })

    const { mutate } = useMutation({
        mutationFn: markNotificationAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications', projectId] })
            queryClient.invalidateQueries({ queryKey: ['unread-counts'] })
        }
    })

    return (
        <Popover className="relative">
            {({ open }) => (
                <>
                    <Popover.Button
                        className="relative p-2 text-gray-500 hover:text-gray-900"
                        onClick={() => {
                            if (!open) {
                                queryClient.fetchQuery({
                                    queryKey: ['notifications', projectId],
                                    queryFn: () => getProjectNotifications(projectId)
                                })
                            }
                        }}
                    >
                        <BellIcon className="h-8 w-8" aria-hidden="true" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </Popover.Button>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Popover.Panel className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                            <div className="max-h-96 overflow-y-auto py-2">
                                {!notifications || notifications.length === 0 ? (
                                    <p className="px-4 py-3 text-sm text-gray-500 text-center">No hay notificaciones</p>
                                ) : (
                                    notifications.map(notification => (
                                        <div
                                            key={notification._id}
                                            className={`px-4 py-3 border-b border-gray-100 last:border-0 ${notification.isRead ? 'bg-white' : 'bg-indigo-50'}`}
                                        >
                                            <p className="text-sm text-gray-700">{notification.message}</p>
                                            <div className="mt-1 flex items-center justify-between">
                                                <span className="text-xs text-gray-400">
                                                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: es })}
                                                </span>
                                                {!notification.isRead && (
                                                    <button
                                                        type="button"
                                                        className="text-xs font-bold text-fuchsia-600 hover:text-fuchsia-700"
                                                        onClick={() => mutate({ projectId, notificationId: notification._id })}
                                                    >
                                                        Marcar como leída
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    )
}