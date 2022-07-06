import { connect } from 'react-redux'
import { useState } from 'react'
import DataTable from './DataTable'
import { columns } from '../../data/secretSantaTableData'
import { TableContainer } from '../modalComponents'
import { Btn } from '../formComponents'
import Modal from '../modal'
import InputWithLabelAndError from '../InputWithLabelAndError'
import { fetchSecretSantaSeason } from '../../redux/actions/dashboardActions'
import { createSecretSantaSeason } from '../../redux/actions/secretSantaSeasonAction'


const SecretSantaDataTable = ({
  fetchSecretSantaSeason,
  createSecretSantaSeason,
}) => {
  const [season, setSeason] = useState({})
  const [createNewSeason, setCreateNewSeason] = useState(false)

  const [errors, setErrors] = useState({})

  const creatingNewSeason = () => setCreateNewSeason(true)
  const validRegEx = /^[\w ]*$/



  const updateSeason = (e) => {
    delete errors[e.target.name]
    if (!e.target.value.match(validRegEx))
      setErrors({ ...errors, [e.target.name]: 'invalid type.' })
    setSeason({ ...season, [e.target.name]: e.target.value })
  }

  //this is required because if we submit empty form we are getting error but status is stil 200:OK
  const checkIfFormIsValid = () => {
    let errorCount = 0
    ;['title', 'year', 'remarks', 'status', 'manager_id'].forEach((field) => {
      if (season[field] === undefined) {
        errorCount += 1
        setErrors({ ...errors, [field]: "Can't be blank." })
      } else if (!String(season[field]).match(validRegEx)) {
        errorCount += 1
        setErrors({ ...errors, [field]: 'empty' })
      }
    })

    return errorCount
  }

  const newSeason = async () => {
    if (checkIfFormIsValid() === 0) {
      createSecretSantaSeason(season)
      setCreateNewSeason(false)
    }
  }

  return (
    <>
      <TableContainer>
        <div className="flex justify-end py-4">
          <Btn
            className="bg-teal-500 hover:bg-teal-600"
            onClick={creatingNewSeason}
          >
            Create New Season
          </Btn>
        </div>

        <DataTable columns={columns} fetchFunction={fetchSecretSantaSeason} />
      </TableContainer>
      {createNewSeason && (
        <Modal
          showModal={createNewSeason}
          setShowModal={setCreateNewSeason}
          title="Create New Season"
        >
          <div className="flex flex-wrap">
            {['title', 'year', 'remarks', 'status', 'manager_id'].map((field) => (
              <InputWithLabelAndError
                name={field}
                onChange={updateSeason}
                value={season[field]}
                errors={errors}
              />
            ))}
          </div>

          <Btn
            className="bg-teal-500 hover:bg-teal-600"
            onClick={() => newSeason()}
          >
            Submit
          </Btn>
        </Modal>
      )}
    </>
  )
}

export default connect(() => ({}), {
  fetchSecretSantaSeason,
  createSecretSantaSeason,
})(SecretSantaDataTable)
