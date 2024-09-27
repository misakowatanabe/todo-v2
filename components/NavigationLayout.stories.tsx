import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import clsx from 'clsx'
import { NavigationLayout } from './NavigationLayout'
import { Icon } from 'components/icons'
import { Button } from 'components/Button'

const meta: Meta<typeof NavigationLayout> = {
  title: 'Design System/NavigationLayout',
  component: NavigationLayout,
  parameters: {
    layout: 'top',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof NavigationLayout>

export const Primary: Story = {
  args: {
    sidemenu: <div>Hello!</div>,
  },
  render: function Render(args) {
    const [isSideNavOpen, setIsSideNavOpen] = useState(false)

    return (
      <div className="flex">
        <NavigationLayout
          {...args}
          appBar={
            <Button
              onClick={() => setIsSideNavOpen(!isSideNavOpen)}
              icon={<Icon.Plus />}
              style="text"
              size="large"
              className={clsx('', {
                visible: isSideNavOpen,
              })}
              aria-expanded={isSideNavOpen ? true : false}
              aria-haspopup="menu"
              aria-label="Side navigation"
            />
          }
        />
        <div className="fixed lg:static top-16 lg:top-0 bottom-0 left-0 overflow-y-auto">
          <div className="mx-2 lg:mx-8">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sit amet sapien lacus.
            Duis a nibh ut dolor convallis semper. Aliquam venenatis mi augue, nec commodo ipsum
            vehicula eget. In ut tellus id tortor imperdiet tincidunt. Aliquam erat volutpat.
            Aliquam erat volutpat. Morbi arcu nulla, suscipit quis euismod id, ultrices id nibh.
            Etiam lorem lacus, consectetur tincidunt justo a, auctor varius lacus. Suspendisse nisi
            erat, interdum in diam sit amet, porttitor luctus massa. Proin non mi placerat, mattis
            mauris sed, feugiat enim. Proin ac convallis purus. Aliquam erat volutpat. Maecenas
            aliquet mauris sit amet urna ornare bibendum. Aliquam iaculis diam mauris, vitae semper
            quam tincidunt et. Sed suscipit sagittis feugiat. Integer ut pharetra orci, vitae
            vestibulum sem. Vivamus vestibulum sapien sit amet nunc imperdiet, vel imperdiet nibh
            vestibulum. Quisque consequat fringilla magna, in tristique magna varius a. Vivamus
            hendrerit purus in commodo pharetra. Etiam vitae suscipit ligula. Nullam nec velit arcu.
            Fusce risus magna, venenatis at ipsum a, viverra tempor arcu. Mauris ut lectus ac enim
            tincidunt faucibus. Nulla suscipit quam sed lobortis congue. Nullam sagittis enim ut
            posuere dictum. Pellentesque porta sit amet lectus non sollicitudin. Nam eu felis
            molestie, feugiat lorem vitae, accumsan massa. Sed luctus, leo in consectetur suscipit,
            orci neque fringilla libero, lacinia bibendum neque dui condimentum felis. Sed vitae
            justo ut tellus consectetur commodo. Pellentesque bibendum vitae lectus at egestas.
            Mauris augue quam, sollicitudin eu rutrum vitae, venenatis quis est. Vivamus congue
            elementum nunc a ornare. Nulla pharetra porta mauris, at congue sapien suscipit at.
            Aliquam tincidunt dui a massa rhoncus maximus. Duis quis commodo turpis. Nulla auctor
            lobortis mollis. Nam eleifend justo et euismod fringilla. In hac habitasse platea
            dictumst. Vivamus pharetra nisi arcu, rutrum cursus felis eleifend vel. Vivamus nec
            mauris quis odio feugiat vulputate non vel dolor. Nullam posuere quam lectus, vitae
            tempus nisl vestibulum ut. Duis risus nisl, finibus quis nisi vitae, vehicula pretium
            nulla. Sed rutrum id velit sit amet vehicula. Mauris nulla massa, gravida nec finibus
            at, condimentum et ipsum. Maecenas auctor ex lorem, id tempus est placerat a. Ut
            fermentum tristique egestas. Sed eu tellus maximus, tempor dolor id, pharetra arcu.
            Maecenas aliquam justo in dignissim fermentum. Aliquam erat volutpat. Suspendisse
            lobortis tellus nec orci luctus, vel tempus purus molestie. Sed eget felis orci. Vivamus
            leo augue, rutrum ac eleifend vel, ultricies quis nibh. Donec lacinia dui ligula,
            bibendum ultrices magna tempus vitae. Sed lobortis et mi eget egestas. Sed tempus lacus
            et ipsum gravida, interdum mattis velit pretium. Sed vehicula interdum justo, eget
            imperdiet diam scelerisque id. Praesent eu sapien nec erat congue fermentum. Curabitur
            vitae accumsan sem. Morbi accumsan, dolor sed pellentesque elementum, mauris felis
            ullamcorper tellus, quis consequat risus massa quis erat. Aliquam enim metus, ultricies
            eget dui id, tincidunt tristique erat. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Nulla sit amet sapien lacus. Duis a nibh ut dolor convallis semper.
            Aliquam venenatis mi augue, nec commodo ipsum vehicula eget. In ut tellus id tortor
            imperdiet tincidunt. Aliquam erat volutpat. Aliquam erat volutpat. Morbi arcu nulla,
            suscipit quis euismod id, ultrices id nibh. Etiam lorem lacus, consectetur tincidunt
            justo a, auctor varius lacus. Suspendisse nisi erat, interdum in diam sit amet,
            porttitor luctus massa. Proin non mi placerat, mattis mauris sed, feugiat enim. Proin ac
            convallis purus. Aliquam erat volutpat. Maecenas aliquet mauris sit amet urna ornare
            bibendum. Aliquam iaculis diam mauris, vitae semper quam tincidunt et. Sed suscipit
            sagittis feugiat. Integer ut pharetra orci, vitae vestibulum sem. Vivamus vestibulum
            sapien sit amet nunc imperdiet, vel imperdiet nibh vestibulum. Quisque consequat
            fringilla magna, in tristique magna varius a. Vivamus hendrerit purus in commodo
            pharetra. Etiam vitae suscipit ligula. Nullam nec velit arcu. Fusce risus magna,
            venenatis at ipsum a, viverra tempor arcu. Mauris ut lectus ac enim tincidunt faucibus.
            Nulla suscipit quam sed lobortis congue. Nullam sagittis enim ut posuere dictum.
            Pellentesque porta sit amet lectus non sollicitudin. Nam eu felis molestie, feugiat
            lorem vitae, accumsan massa. Sed luctus, leo in consectetur suscipit, orci neque
            fringilla libero, lacinia bibendum neque dui condimentum felis. Sed vitae justo ut
            tellus consectetur commodo. Pellentesque bibendum vitae lectus at egestas. Mauris augue
            quam, sollicitudin eu rutrum vitae, venenatis quis est. Vivamus congue elementum nunc a
            ornare. Nulla pharetra porta mauris, at congue sapien suscipit at. Aliquam tincidunt dui
            a massa rhoncus maximus. Duis quis commodo turpis. Nulla auctor lobortis mollis. Nam
            eleifend justo et euismod fringilla. In hac habitasse platea dictumst. Vivamus pharetra
            nisi arcu, rutrum cursus felis eleifend vel. Vivamus nec mauris quis odio feugiat
            vulputate non vel dolor. Nullam posuere quam lectus, vitae tempus nisl vestibulum ut.
            Duis risus nisl, finibus quis nisi vitae, vehicula pretium nulla. Sed rutrum id velit
            sit amet vehicula. Mauris nulla massa, gravida nec finibus at, condimentum et ipsum.
            Maecenas auctor ex lorem, id tempus est placerat a. Ut fermentum tristique egestas. Sed
            eu tellus maximus, tempor dolor id, pharetra arcu. Maecenas aliquam justo in dignissim
            fermentum. Aliquam erat volutpat. Suspendisse lobortis tellus nec orci luctus, vel
            tempus purus molestie. Sed eget felis orci. Vivamus leo augue, rutrum ac eleifend vel,
            ultricies quis nibh. Donec lacinia dui ligula, bibendum ultrices magna tempus vitae. Sed
            lobortis et mi eget egestas. Sed tempus lacus et ipsum gravida, interdum mattis velit
            pretium. Sed vehicula interdum justo, eget imperdiet diam scelerisque id. Praesent eu
            sapien nec erat congue fermentum. Curabitur vitae accumsan sem. Morbi accumsan, dolor
            sed pellentesque elementum, mauris felis ullamcorper tellus, quis consequat risus massa
            quis erat. Aliquam enim metus, ultricies eget dui id, tincidunt tristique erat.
          </div>
        </div>
      </div>
    )
  },
}
