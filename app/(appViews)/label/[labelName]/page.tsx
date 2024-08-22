import MatchedTodoList from './matchedTodoList'

export default function Page({ params }: { params: { labelName: string } }) {
  const label = params.labelName

  return <MatchedTodoList label={label} />
}
