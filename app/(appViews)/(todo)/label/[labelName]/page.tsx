import MatchedTodoList from './matchedTodoList'
import { Heading } from '../../../Heading'

export default function Page({ params }: { params: { labelName: string } }) {
  const label = params.labelName

  return (
    <>
      <div>
        {/* add button group and others as action */}
        <Heading title={label.replace(/_/g, ' ')} />
      </div>
      <MatchedTodoList labelParam={label} />
    </>
  )
}
