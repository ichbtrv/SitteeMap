

const LoadingDots: React.FC = () => {
  return (
    <span className={"root"}>
      <span className={"dot"} key={`dot_1`} />
      <span className={"dot"} key={`dot_2`} />
      <span className={"dot"} key={`dot_3`} />
    </span>
  )
}

export default LoadingDots