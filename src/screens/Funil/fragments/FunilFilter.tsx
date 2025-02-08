import React, { useState } from 'react'
import {
  Category,
  CategoryMultiSelector,
} from '../../../components/Common/CategoryMultiSelector/CategoryMultiSelector'
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap'
import { AgencySelect } from '../../../components/Common/CategoryMultiSelector/AgencySelec'
import Flatpickr from 'react-flatpickr'
import { Portuguese } from 'flatpickr/dist/l10n/pt.js'
import { WithContext as ReactTags } from 'react-tag-input';
import './../../../helpers/ReactTags.css';

export const FunilFilter = ({ toggle, isOpen, onApplyFilter, from }) => {
  const [filter, setFilter] = useState({
    sectors: [],
    category_sector: [],
    temperature: [],
    origem: [],
    agency: '',
    createdStart: '',
    createdEnd: '',
    interactedStart: '',
    interactedEnd: '',
    tags: [],
  })

  const handleDeleteTag = (i) => {
    const newTags = filter.tags.filter((tag, index) => index !== i);
    setFilter({ ...filter, tags: newTags });
  };

  const handleAdditionTag = (tag) => {
    setFilter({ ...filter, tags: [...filter.tags, tag] });
  };

  const handleFilter = () => {
    const fieldMap = {
      origem: 'origins',
      agency: 'agencies',
      company: 'companies',
      sectors: 'sectors',
      category_sector: 'categories',
      temperature: 'temperatures',
      createdStart: 'createdFrom',
      createdEnd: 'createdTo',
      interactedStart: 'updatedFrom',
      interactedEnd: 'updatedTo',
      tags: 'tags',
    };

    // const apiFilters = Object.entries(filter).reduce((acc, [key, value]) => {
    //   const apiKey = fieldMap[key];
    //   if (value && apiKey) {
    //     if (['origins', 'agencies', 'companies', 'sectors', 'categories', 'temperatures', 'tags'].includes(apiKey)) {
    //       if (Array.isArray(value) && value.length > 0) {
    //         acc[apiKey] = value;
    //       }
    //     } else if (value) {
    //       acc[apiKey] = value;
    //     }
    //   }
    //   return acc;
    // }, {});
    const apiFilters = Object.entries(filter).reduce((acc, [key, value]) => {
      const apiKey = fieldMap[key];
      if (value && apiKey) {
        if (['origins', 'agencies', 'companies', 'sectors', 'categories', 'temperatures', 'tags'].includes(apiKey)) {
          if (Array.isArray(value) && value.length > 0) {
            if (key === 'tags') {
              // Map over the tag objects to extract the text property
              acc[apiKey] = value.map(tag => tag.text);
            } else {
              acc[apiKey] = value;
            }
          }
        } else if (value) {
          acc[apiKey] = value;
        }
      }
      return acc;
    }, {});

    console.log("Filtros para API:", JSON.stringify(apiFilters));
    onApplyFilter(apiFilters);
    toggle();
  };

  const resetAndApplyFilters = () => {
    const clearedFilters = {
      sectors: [],
      category_sector: [],
      temperature: [],
      origem: [],
      agency: '',
      createdStart: '',
      createdEnd: '',
      interactedStart: '',
      interactedEnd: '',
      tags: [],
    };
    setFilter(clearedFilters)
    handleFilter()
  };

  return (
    <Modal isOpen={isOpen} centered={true} size="lg" toggle={toggle}>
      <ModalHeader toggle={toggle}>Filtros</ModalHeader>
      <ModalBody>
        <CategoryMultiSelector>

          <div className="form-group mb-4">
            <h5 style={{ fontSize: '1rem' }}>Cadastro de:</h5>
            <Flatpickr
              mode="range"
              className="form-control d-block"
              placeholder="Selecione as datas..."
              onChange={([start, end]) => {
                setFilter({
                  ...filter,
                  createdStart: start,
                  createdEnd: end,
                })
              }}
              value={[filter.createdStart, filter.createdEnd]}
              options={{
                locale: Portuguese,
                mode: 'range',
                dateFormat: 'd/m/Y',
              }}
            />
          </div>

          {from === 'lead' && (
            <div className="form-group mb-2">
              <h5 style={{ fontSize: '1rem' }}>Última interação de:</h5>
              <Flatpickr
                mode="range"
                className="form-control d-block"
                placeholder="Selecione as datas..."
                onChange={([start, end]) => {
                  setFilter({
                    ...filter,
                    interactedStart: start,
                    interactedEnd: end,
                  })
                }}
                value={[filter.interactedStart, filter.interactedEnd]}
                options={{
                  locale: Portuguese,
                  mode: 'range',
                  dateFormat: 'd/m/Y',
                }}
              />
            </div>
          )}

          {from === 'lead' && (
            <Category
              type="origem"
              title="Origem"
              handle={{ filter, setFilter }}
            />
          )}

          <Category
            type="sectors"
            title="Setores"
            handle={{ filter, setFilter }}
            isMulti={false}
          />
          <Category
            type="category_sector"
            title="Categoria"
            filterBy={(item) => item.key.startsWith(filter.sectors[0])}
            handle={{ filter, setFilter }}
          />

          {from === 'leadx' && (
            <Category
              type="temperature"
              title="Temperatura"
              handle={{ filter, setFilter }}
            />
          )}

          {from === 'leadx' && (
            <div className="form-group mb-4">
              <h5 style={{ fontSize: '1rem' }}>Agência</h5>
              <AgencySelect handle={{ filter, setFilter }} />
            </div>
          )}

          {from === 'people' && (
            <div className="form-group mb-4">
              <h5 style={{ fontSize: '1rem' }}>Tags</h5>
              <ReactTags
                tags={filter.tags}
                handleDelete={handleDeleteTag}
                handleAddition={handleAdditionTag}
                inputFieldPosition="bottom"
                placeholder="Digite e pressione Enter para adicionar uma nova tag"
                autocomplete
                classNames={{
                  tags: 'd-flex flex-wrap align-items-center',
                  tagInput: 'flex-grow-1',
                  tagInputField: 'form-control border-0',
                  selected: 'd-flex flex-wrap',
                  tag: 'badge bg-primary me-1 mb-1',
                  remove: 'ms-1',
                }}
              />
            </div>
          )}

        </CategoryMultiSelector>
      </ModalBody>
      <ModalFooter>
        <Button
          onClick={() => {
            resetAndApplyFilters()
          }}
        >
          Resetar
        </Button>
        <Button onClick={() => handleFilter()} color="primary">
          Aplicar
        </Button>
      </ModalFooter>
    </Modal>
  )
}
