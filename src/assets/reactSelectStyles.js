const customSelectStyles  = {
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#ffcc00' : state.isFocused ? '#DB0000' : 'white',
    color: state.isSelected ? '#DB0000' : '#fff',
    color: state.isFocused ? '#fff' : '#DB0000',
    padding: 10,
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: '#DB0000',
    color: '#fff',
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: '#fff',
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: '#999',
    ':hover': {
      backgroundColor: '#ccc',
      color: '#000',
    },
  }),
}

export default customSelectStyles;