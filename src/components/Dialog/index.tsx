import { Dialog as HeadlessDialog, Transition } from "@headlessui/react"
import { XIcon } from "@heroicons/react/solid"
import { Fragment } from "react"

export type DialogProps = {
    show: boolean
    onClose: () => void
    children?: React.ReactNode
    title?: string
    fullWidth?: boolean
}

export const Dialog: React.FC<DialogProps> = ({ show, onClose, children, title, fullWidth = false }) => {
    return (
        <>
            {/* <div className="fixed inset-0 flex items-center justify-center">
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                >
                    Open dialog
                </button>
            </div> */}

            <Transition appear show={show} as={Fragment}>
                <HeadlessDialog as="div" className="relative z-10" onClose={onClose}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <HeadlessDialog.Panel
                                    className={fullWidth
                                        ? "inline-block w-full max-w-6xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl"
                                        : "inline-block w-full max-w-md my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl p-3"
                                    }
                                >
                                    {!title
                                        ? null
                                        : (
                                            <HeadlessDialog.Title
                                                as="h3"
                                                className="flex-1 font-bold text-xl pb-3"
                                            >
                                                {title}
                                            </HeadlessDialog.Title>
                                        )}

                                    {children}

                                    <button
                                        type="button"
                                        className="absolute top-0 right-0 px-2 py-2 text-sm font-medium bg-green-300 text-black hover:text-gray-700 border border-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-300"
                                        onClick={onClose}
                                    >
                                        <XIcon className="w-4 h-4" />
                                    </button>
                                </HeadlessDialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </HeadlessDialog>
            </Transition>
        </>
    )
}
