import * as XLSX from 'xlsx'

const isValidCNPJ = (cnpj) => {
  if (typeof cnpj !== 'string') return false
  cnpj = cnpj.replace(/[^\d]+/g, '')
  if (cnpj.length !== 14) return false

  let length = cnpj.length - 2
  let numbers = cnpj.substring(0, length)
  let digits = cnpj.substring(length)
  let sum = 0
  let pos = length - 7

  for (let i = length; i >= 1; i--) {
    sum += numbers.charAt(length - i) * pos--
    if (pos < 2) pos = 9
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== Number(digits.charAt(0))) return false

  length += 1
  numbers = cnpj.substring(0, length)
  sum = 0
  pos = length - 7

  for (let i = length; i >= 1; i--) {
    sum += numbers.charAt(length - i) * pos--
    if (pos < 2) pos = 9
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== Number(digits.charAt(1))) return false

  return true
}

export const readExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const arrayBuffer = event.target.result
      const workbook = XLSX.read(arrayBuffer, { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)
      resolve(jsonData)
    }
    reader.onerror = (error) => {
      reject(error)
    }
    reader.readAsArrayBuffer(file)
  })
}

export const processLeads = (data) => {
  const validLeads = []
  const invalidLeads = []

  data.forEach((row) => {
    const company = {
      name: row.Cliente,
      alias: row.Cliente,
      documents: [{ type: 'cnpj', value: row.CNPJ }],
      contacts: [{ type: 'setor', value: row['Setor Monitor'] }],
    }

    if (!row.Cliente || !isValidCNPJ(row.CNPJ)) {
      invalidLeads.push({ ...row, reason: 'Cliente ou CNPJ inválido' })
      return
    }

    const contactName = row['Nome da pessoa chave']
    let contact = null
    if (contactName) {
      contact = {
        name: contactName,
        alias: contactName,
        contacts: [
          { type: 'phone', value: row.Telefone },
          { type: 'celular', value: row.Telefone },
          { type: 'email', value: row['E-mail'] },
        ],
        relations: [
          { _id: '{{id_da_company}}', type: 'company', description: '' },
        ],
      }

      if (row.Cargo && row.Cargo.trim() !== '') {
        contact.contacts.push({ type: 'cargo', value: row.Cargo })
      }
    } else {
      if (row.Telefone) {
        company.contacts.push({ type: 'phone', value: row.Telefone })
        company.contacts.push({ type: 'celular', value: row.Telefone })
      }
      if (row['E-mail']) {
        company.contacts.push({ type: 'email', value: row['E-mail'] })
      }
    }

    const lead = {
      step: '',
      company: '{{id_da_company}}',
      agency: '',
      contacts: contact
        ? [
            {
              person: '{{id_do_contact}}',
              ref: '{{id_da_company}}',
              strategic: true,
            },
          ]
        : [],
      owner: '{{id_do_usuario}}',
      origin: 'lista',
      title: '',
    }

    validLeads.push({ company, contact, lead })
  })

  return { validLeads, invalidLeads }
}
