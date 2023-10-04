interface MultiStepProps {
    size: number
    currentStep: number
}

export function MultiStep({ size, currentStep }: MultiStepProps) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-xs text-zinc-400">Passo {currentStep} de {size}</label>
            <div className="flex gap-2">
                {Array.from({ length: size }).map((_, i) => (
                    <div key={i} className={`w-full h-1 rounded-[1px] ${currentStep >= i + 1 ? 'bg-zinc-200' : 'bg-zinc-800'}`} />
                ))}
            </div>
        </div>
    )
}