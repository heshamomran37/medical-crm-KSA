export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-[#b78a5d]/10 border-t-[#b78a5d] animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-[#b78a5d] rounded-full animate-pulse"></div>
                </div>
            </div>
        </div>
    );
}
