import React from 'react'
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore'
import { X } from 'lucide-react'

function ChatHeader() {
    const {selectedUser, setSelectedUser} = useChatStore()
    const {onlineUsers} = useAuthStore()

  return (
    <div className="p-2 border-b border-base-300">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="avatar">
                    <div className="size-10  rounded-full relative">
                        <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} /> {/*
                        Pegando os dados do usuario selecionado */}
                    </div>
                </div>

                {/* Informacoes do usuario */}
                <div>
                    <h3 className="font-medium">{selectedUser.fullName}</h3>
                    <p className="text-sm text-base-content/70">
                    {selectedUser.status === "online" ? "Online" : "Offline"}
                    </p>
                </div>
            </div>

            {/* botao para fechar */}
            <button onClick={()=> setSelectedUser(null)}>
                <X/>
            </button>
        </div>
    </div>
  )
}

export default ChatHeader
