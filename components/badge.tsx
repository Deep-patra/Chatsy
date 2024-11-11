interface BadgeProps {
  amount: number
  children: JSX.Element
  badgeColor?: string
}

export default function Badge({ amount, badgeColor, children }: BadgeProps) {
  return (
    <div className="relative">
      {amount !== 0 && (
        <span
          style={{
            backgroundColor: badgeColor || '#ff5252',
            fontSize: '8px',
            fontWeight: 'bold',
            paddingInline: '1px',
            paddingBlock: '0.5px',
          }}
          className="absolute top-0 right-0 | text-midBlack | rounded-md"
        >
          {amount}
        </span>
      )}

      {children}
    </div>
  )
}
