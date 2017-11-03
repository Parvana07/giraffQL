import React, { Component } from 'react';
import '../css/App.css';
import Visualization from './table/Visualization';
//DRAFT JS DEPENDENCIES
import { Editor, EditorState, RichUtils, convertFromRaw } from 'draft-js';
import TextEditor from './Editor';
//TEXT CSS
import '../index.css';
import '../css/prism.css';
//SCHEMA CODE COMPONENT//
import SchemaCode from './code/SchemaCode';
//PRISM DEPENDENCIES
const PrismDecorator = require('draft-js-prism');
const Prism = require('prismjs')

//PRISM LIBRARY FOR SYNTAX HIGHLIGHTING//
const decorator = new PrismDecorator({
  defaultSyntax: 'javascript',
  prism: Prism,
});

//contentState to provide raw text for code block
const contentState = convertFromRaw({
  entityMap: {},
  blocks: [
    {
      type: 'code-block',
      text: `const work = (doWork) =>  'now'`
    }
  ]
});

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {
        tables: [
        ]
      },
      //DRAFTJS STATE//
      editorState: EditorState.createWithContent(contentState, decorator),
    };

    this.onChange = (editorState) => {
      this.setState({ editorState });
    }
  };
  //DRAFTJS METHODS//
  handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(this.state.editorState, command);

    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not handled';
  }

  onUnderlineClick = () => {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE'));
  }

  onToggleCode = () => {
    console.log('test');
    this.onChange(RichUtils.toggleCode(this.state.editorState));
  }


  onAddTable = () => {
    let newstate = this.state.data.tables.slice()
    this.setState({
      data:{
        tables:newstate.concat({
            name: '',
            attributes: [
              { field: '', type: '' }
            ]
          })
    // this.setState(prevState => {
    //   return {
    //     data: {
    //       tables: prevState.data.tables.concat({
    //         name: '',
    //         attributes: [
    //           { name: '', type: '' }
    //         ]
    //       })
    //     }
    //   }
    // })
    }
  })
}

  //this is not correct way to do because state has to be immutable (but it's working)
  onAddRow = (index) => {
    this.setState(state => {
      let tableObj = state.data.tables[index]
      tableObj.attributes.push({ field: '', type: '' })
      return state
    })
  }

  updateTableName = (tableIndex, value) => {
    this.setState(state => {
      let table = state.data.tables[tableIndex]
      table.name = value
      return state
    })
  }

  updateRowProp = (tableIndex, rowIndex, value) => {
    this.setState(state => {
      // console.log(tableIndex, rowIndex, value)
      let rowProp = state.data.tables[tableIndex].attributes[rowIndex]
      rowProp.field = value;
      return state;
    })
  }

  updateRowType = (tableIndex, rowIndex, value) => {
    this.setState(state => {
      let rowType = state.data.tables[tableIndex].attributes[rowIndex]
      rowType.type = value;
      return state;
    })
  }

  render() {
    return (
      <div className="App">
        <button onClick={this.onAddTable}> Create table </button>
        <button> Add relations </button>

        <Visualization data={this.state.data} onAddRow={this.onAddRow} onAddTable={this.onAddTable}
          updateTableName={this.updateTableName} updateRowProp={this.updateRowProp}
          updateRowType={this.updateRowType} />
        {/* <div className="TextEditor">
          <button onToggleCode={this.onToggleCode}>Code Block</button>
          <TextEditor editorState={this.state.editorState} handleKeyCommand={this.handleKeyCommand} onChange={this.onChange} />
        </div> */}
        <SchemaCode code={this.state.data.tables}>
        </SchemaCode>
      </div>

    );
  }
}

export default App;