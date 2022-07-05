import { connect } from 'react-redux'
import { useState, useEffect } from 'react'
import DataTable from './DataTable'
import { columns } from '../../data/secretSantaTableData'
import { TableContainer } from '../modalComponents'
import { Btn, Label } from '../formComponents'
import AsyncSelect from 'react-select/async'
import Modal from '../modal'
import InputWithLabelAndError from '../InputWithLabelAndError'
import { fetchSecretSantaSeason } from '../../redux/actions/dashboardActions'
import { createSecretSantaSeason } from '../../redux/actions/secretSantaSeasonAction'
import { searchRequest, fetchUsers } from '../../lib/queries'


const SecretSantaDataTable = ({
  fetchSecretSantaSeason,
  createSecretSantaSeason,
}) => {
  const [season, setSeason] = useState({})
  const [createNewSeason, setCreateNewSeason] = useState(false)
  const [userOptions, setUserOptions] = useState([])

  const [errors, setErrors] = useState({})

  const creatingNewSeason = () => setCreateNewSeason(true)
  const validRegEx = /^[\w ]*$/

  useEffect(() => {
    const setOptions = async () => {
      const users = await fetchUsers()
      setUserOptions(users)
    }

    setOptions()
  }, [])

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
            {['title', 'year', 'remarks', 'status'].map((field) => (
              <InputWithLabelAndError
                name={field}
                onChange={updateSeason}
                value={season[field]}
                errors={errors}
              />
            ))}
          </div>
          <AsyncSelect
            placeholder="Select Manager"
            onChange={(e) => {
              updateSeason({ ...season, user_id: e.value })
            }}
            defaultOptions={userOptions}
            loadOptions={(query) => searchRequest(query)}
          />



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
