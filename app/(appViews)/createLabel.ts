import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from 'app/firebase'
import { User } from 'firebase/auth/web-extension'
import { ChipColor } from 'components/Chip'

// it creates a new label
export async function createLabel(uid: User['uid'], labelName: string, color: ChipColor) {
  createLabels: try {
    const labels = await getDoc(doc(db, uid, 'labels'))
    const labelsData = labels.data()
    const objectName = labelName.replace(/ /g, '_').toLowerCase()

    // create a labels doc if there is none, ex: when creating the first label after signup
    if (!labelsData) {
      await setDoc(doc(db, uid, 'labels'), {
        [objectName]: {
          label: labelName,
          color: color,
        },
      })

      break createLabels
    }

    const isNotDuplicated = Object.keys(labelsData).every((el) => el !== objectName)

    if (isNotDuplicated) {
      await updateDoc(doc(db, uid, 'labels'), {
        [objectName]: {
          label: labelName,
          color: color,
        },
      })
    } else {
      return { ok: false, error: 'This label name already exists.' }
    }
  } catch (err) {
    return { ok: false, error: 'Something happened! Could not create a label.' }
  }

  return { ok: true, error: '' }
}
