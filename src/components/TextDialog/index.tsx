import { Dialog, Transition } from "@headlessui/react"
import { Fragment } from "react"
import { XIcon } from "@heroicons/react/solid"

export type TextDialogProps = {
    open: boolean
    onClose: () => void
}

export const TextDialog: React.FC<TextDialogProps> = props => {
    return (
        <>
            <Transition appear show={props.open} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 z-10 overflow-y-auto"
                    onClose={props.onClose}
                >
                    <div className="min-h-screen px-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-black opacity-70" />
                        </Transition.Child>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span
                            className="inline-block h-screen align-middle"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div className="inline-block w-full max-w-md my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl p-3">
                                {/* <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900"
                                >
                                    Payment successful
                                </Dialog.Title> */}

                                {props.children}

                                <button
                                    type="button"
                                    className="absolute top-0 right-0 px-2 py-2 text-sm font-medium bg-green-300 text-black hover:text-gray-700 border border-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-300"
                                    onClick={props.onClose}
                                >
                                    <XIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}
