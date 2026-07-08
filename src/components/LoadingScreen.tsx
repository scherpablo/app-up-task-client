import Logo from '@/components/Logo'

export default function LoadingScreen() {
    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="flex flex-col items-center">
                <div className="w-96">
                    <Logo />
                </div>

                <h1 className="text-2xl font-black text-white mt-10">Cargando aplicación...</h1>
            </div>
        </div>
    )
}