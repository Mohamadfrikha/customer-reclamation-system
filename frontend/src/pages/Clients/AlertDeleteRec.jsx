import React from 'react'
import { Trash2 } from 'lucide-react'
export default function AlertDeleteRec({setDeleteId, handleDelete}) {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div data-theme="silk" className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-sm border border-base-300 overflow-hidden">

                        {/* Header */}
                        <div className="flex items-center gap-3 px-6 py-4 bg-error/5 border-b border-error/15">
                            <div className="p-2 bg-error/10 rounded-xl">
                            <Trash2 size={16} className="text-error" />
                            </div>
                            <div>
                            <h3 className="text-sm font-extrabold text-base-content leading-none">Supprimer la réclamation</h3>
                            <p className="text-[11px] text-base-content/45 mt-0.5">Cette action est irréversible</p>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="px-6 py-5">
                            <p className="text-sm text-base-content/65 leading-relaxed">
                            Êtes-vous sûr de vouloir supprimer cette réclamation ? Elle sera définitivement supprimée.
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-base-200 bg-base-200">
                            <button
                            onClick={() => setDeleteId(null)}
                            className="btn btn-ghost btn-sm rounded-xl border border-base-300 font-bold text-xs"
                            >
                            Annuler
                            </button>
                            <button
                            onClick={handleDelete}
                            className="btn btn-error btn-sm rounded-xl font-bold text-xs gap-1.5 text-white"
                            >
                            <Trash2 size={12} /> Supprimer
                            </button>
                        </div>

                        </div>
                    </div>
  )
}
