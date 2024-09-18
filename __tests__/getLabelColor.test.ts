import { getLabelColor } from 'app/(appViews)/(todo)/todoListItem'
import { Label } from 'app/appContext'

describe('getLabelColor', () => {
  it('returns a color based on label', () => {
    const availableLabels: Label[] = [
      {
        color: 'blueberry',
        label: 'Work',
      },
      {
        color: 'raspberry',
        label: 'Personal',
      },
      {
        color: 'honey',
        label: 'Kids',
      },
    ]

    expect(getLabelColor('Work', availableLabels)).toBe('blueberry')
  })

  it('returns default color unless labels info is available', () => {
    const availableLabels: Label[] | null = null

    expect(getLabelColor('Work', availableLabels)).toBe('default')
  })
})
