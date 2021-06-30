import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Typography, Divider } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import AddCircleOutlined from '@material-ui/icons/AddCircleOutlined';

import PatientInfo from 'components/PatientInfo';
import PatientProgress from 'components/PatientProgress';
import DiagnosticsTable from 'components/DiagnosticsTable';
import BodyPart from 'components/BodyPart';

import WebcamImg from 'assets/images/webcam.png';
import UploadImg from 'assets/images/upload.png';
import DeleteImg from 'assets/images/delete.png';
import CheckImg from 'assets/images/check.png';
import CloseLineImg from 'assets/images/closeLine.png';
import CheckLineImg from 'assets/images/checkLine.png';
import RedEditImg from 'assets/images/red-edit.png';

import styles from './styles';
import Diagnosis from './diagnosis';

const SELECT_TREE = 0;
const SELECT_NODE = 1;
const CHOOSE_INTENSITY = 2;
const UPLOAD_PHOTO = 3;
const ADD_COMMENT = 4;
const ADD_CONDITION = 5;
const ANSWER_QUESTION = 6;
const SAVE_DIAGNOSIS = 7;

/**
 * @name DiagnosticsNewPageComponents
 *
 *
 * @param {Object}   user
 * @param {Object}   literals
 *
 * @returns {JSX}
 */
class DiagnosticsNewPageComponents extends Component {
  static propTypes = {
    literals: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    nodes: PropTypes.array.isRequired,
    getTreesAction: PropTypes.func.isRequired,
    getNodesAction: PropTypes.func.isRequired,
    initNodesAction: PropTypes.func.isRequired,
  };

  state = {
    currentPage: 0,
    tree: [],
    currentNode: -1,
    currentRoot: -1,
    nextEnable: false,
    selectedBody: [false, false, false, false, false, false], // SELECT_TREE
    // selectedNode: [], // SELECT_TREE
    radioValue: 0, // CHOOSE_INTENSITY
    newCondition: '', // ADD_CONDITION
    conditions: [], // ADD_CONDITION
  };

  componentDidMount() {
    const {
      getTreesAction,
    } = this.props;

    getTreesAction();
  }

  // componentWillReceiveProps(nextProps){
  //   const {
  //     nodes,
  //   } = this.props;

  //   if (nodes !== nextProps.nodes){
  //     const newSelected = nextProps.nodes.map(() => (
  //       false
  //     ));

  //     this.setState({
  //       selectedNode: newSelected,
  //     });
  //   }
  // }

  componentDidUpdate(prevProps, prevState) {
    const {
      getNodesAction,
    } = this.props;

    const {
      currentNode,
      currentPage,
      tree,
    } = this.state;

    if (currentPage !== prevState.currentPage && currentPage === SELECT_NODE) {
      getNodesAction(tree[currentNode].id);
    }
  }

  /**
   * @name handleRedirect
   * Function to control page redirect
   */
  handleRedirect = path => () => {
    const {
      history,
    } = this.props;

    history.push(path);
  };

  /**
   * @name handlePageFlow
   * Function to control page flow
   */
  handlePageFlow = next => () => {
    const {
      currentPage,
      selectedBody,
    } = this.state;

    const {
      initNodesAction,
    } = this.props;

    let nextPage = currentPage;

    const {
      nodes,
    } = this.props;

    if (currentPage === SELECT_TREE) {
      console.log(selectedBody);
      console.log('4444444444444444444444444444444');
      const selectedTrees = nodes.filter((object, index) => {
        return selectedBody[index];
      });

      initNodesAction();

      console.log(selectedTrees[0].id - 1);

      this.setState({
        tree: selectedTrees,
        currentRoot: selectedTrees[0].id - 1,
        currentNode: 0,
      });

      nextPage += 1;
    } else if (currentPage === SELECT_NODE) {
      if (next) {
        // const selectedNodex = nodes.filter((object, index) => {
        //   return selectedBody[index];
        // });
        // if (tree[currentNode])
        nextPage = currentPage + 1;
      }
    }

    // if (next) {
    //   nextPage = currentPage + 1;
    // } else {
    //   nextPage = currentPage - 1;
    // }

    this.setState({
      currentPage: nextPage,
    });
  }

  /**
   * @name handleBodySelect
   * Function to control SELECT_TREE Page
   */
  handleBodySelect = (selectedId) => {
    const {
      selectedBody,
    } = this.state;

    const selected = selectedBody.map((value, id) => {
      if (selectedId === id) {
        return !value;
      }
      return value;
    });

    const selectedTrue = selected.filter((value) => {
      return value;
    });

    this.setState({
      selectedBody: selected,
      nextEnable: selectedTrue.length > 0,
    });
  }

  /**
   * @name handleCheckNode
   * Function to control SELECT_NODE page
   */
  handleCheckNode = (selectedId) => {
    console.log(selectedId);
  }

  handleRadioChange = (event) => {
    this.setState({ radioValue: event.target.value });
  };

  addCondition = () => {
    const {
      conditions,
      newCondition,
    } = this.state;

    if (newCondition !== '') {
      const newArray = conditions.slice();
      newArray.push(newCondition);

      this.setState({
        conditions: newArray,
      });

      this.setState({
        newCondition: '',
      });
    }
  }

  handleChangeCondition = (e) => {
    this.setState({ newCondition: e.target.value });
  }

  render() {
    const {
      literals,
      classes,
      nodes,
    } = this.props;

    const {
      currentPage,
      currentRoot,
      tree,
      currentNode,
      selectedBody,
      radioValue,
      newCondition,
      conditions,
      nextEnable,
    } = this.state;

    console.log(tree);
    console.log(currentNode);

    return (
      <div className='ProfilePage'>
        {currentPage !== SAVE_DIAGNOSIS && (
          <React.Fragment>
            <Grid container>
              <PatientInfo />
            </Grid>
            <Grid container className={classes.mainSection}>
              <Grid item md={5} xs={12} className={classes.leftSection}>
                <Grid container direction='column' spacing={32}>
                  <Grid item>
                    <PatientProgress editable={false} />
                  </Grid>
                  <Grid item>
                    <Typography className={classes.tableName}>
                      {literals.past}
                    </Typography>
                    <Grid container className={classes.borderBox}>
                      <DiagnosticsTable search={false} entires={false} photoShow={false} />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={7} xs={12} className={classes.rightSection}>
                {currentPage === SELECT_TREE && (
                  <Grid container className={classes.addSection} justify='center'>
                    <BodyPart size='large' selectable handleSelect={this.handleBodySelect} selectedIds={selectedBody} />
                  </Grid>
                )}
                {currentPage === SELECT_NODE && (
                  <Grid container className={classes.addSection} direction='row' spacing={40}>
                    <Grid item>
                      <BodyPart size='large' selectedIds={selectedBody} focusId={currentRoot} />
                    </Grid>
                    <Grid item className={classes.flowSection}>
                      <Grid container direction='column' spacing={8}>
                        <Grid item>
                          <Typography className={classes.title}>
                            Select trunk injury:
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography className={classes.label}>
                            Pay attention in the description given by the patient and select the specific injury.
                          </Typography>
                        </Grid>
                        {nodes.map((object, index) => (
                          <Grid key={index} item container alignItems='center' className={classes.checkboxSection}>
                            <Grid item>
                              <Checkbox onChange={this.handleCheckNode(index)} color='primary' />
                            </Grid>
                            <Grid item>
                              <Typography>
                                {object.name}
                              </Typography>
                            </Grid>
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  </Grid>
                )}
                {currentPage === CHOOSE_INTENSITY && (
                  <Grid container className={classes.addSection} direction='row' spacing={40}>
                    <Grid item>
                      <BodyPart size='large' selectedIds={selectedBody} focusId={currentRoot} />
                    </Grid>
                    <Grid item className={classes.flowSection}>
                      <Grid container direction='column' spacing={8}>
                        <Grid item>
                          <Typography className={classes.title}>
                            (Optional) Select injury intensity
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography className={classes.description}>
                            <span className={classes.label}>
                              Select the injury Intensity of
                            </span>
                            {' '}
                            Stenosis with obstruction on swallowing.
                          </Typography>
                        </Grid>
                        <Grid item>
                          <RadioGroup
                            aria-label='position'
                            name='position'
                            value={radioValue}
                            onChange={this.handleRadioChange}
                            row
                          >
                            <FormControlLabel
                              value='1'
                              control={<Radio color='primary' />}
                              label='1'
                              labelPlacement='bottom'
                            />
                            <FormControlLabel
                              value='2'
                              control={<Radio color='primary' />}
                              label='2'
                              labelPlacement='bottom'
                            />
                            <FormControlLabel
                              value='3'
                              control={<Radio color='primary' />}
                              label='3'
                              labelPlacement='bottom'
                            />
                            <FormControlLabel
                              value='4'
                              control={<Radio color='primary' />}
                              label='4'
                              labelPlacement='bottom'
                            />
                            <FormControlLabel
                              value='5'
                              control={<Radio color='primary' />}
                              label='5'
                              labelPlacement='bottom'
                            />
                            <FormControlLabel
                              value='6'
                              control={<Radio color='primary' />}
                              label='6'
                              labelPlacement='bottom'
                            />
                            <FormControlLabel
                              value='7'
                              control={<Radio color='primary' />}
                              label='7'
                              labelPlacement='bottom'
                            />
                            <FormControlLabel
                              value='8'
                              control={<Radio color='primary' />}
                              label='8'
                              labelPlacement='bottom'
                            />
                            <FormControlLabel
                              value='9'
                              control={<Radio color='primary' />}
                              label='9'
                              labelPlacement='bottom'
                            />
                            <FormControlLabel
                              value='10'
                              control={<Radio color='primary' />}
                              label='10'
                              labelPlacement='bottom'
                            />
                          </RadioGroup>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                )}
                {currentPage === UPLOAD_PHOTO && (
                  <Grid container className={classes.addSection} direction='row' spacing={40}>
                    <Grid item>
                      <BodyPart size='large' selectedIds={selectedBody} focusId={currentRoot} />
                    </Grid>
                    <Grid item className={classes.flowSection}>
                      <Grid container direction='column' spacing={8}>
                        <Grid item>
                          <Typography className={classes.title}>
                            (Optional) Add a photo for this injury
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography className={classes.label}>
                            If it is necesary take a pincture of the injury and upload it here.
                          </Typography>
                        </Grid>
                        <Grid item className={classes.buttonSection}>
                          <Button variant='text' className={classes.photoButton}>
                            SELECT DOCUMENT
                            <img src={UploadImg} alt='upload_icon' />
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button variant='text' className={classes.photoButton}>
                            TAKE A PICTURE
                            <img src={WebcamImg} alt='webcam_icon' />
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                )}
                {currentPage === ADD_COMMENT && (
                  <Grid container className={classes.addSection} direction='row' spacing={40}>
                    <Grid item>
                      <BodyPart size='large' selectedIds={selectedBody} focusId={currentRoot} />
                    </Grid>
                    <Grid item className={classes.flowSection}>
                      <Grid container direction='column' spacing={8}>
                        <Grid item>
                          <Typography className={classes.title}>
                            (Optional) Add a comment
                          </Typography>
                        </Grid>
                        <Grid item className={classes.textareaSection}>
                          <textarea className={classes.textarea} placeholder='message' />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                )}
                {currentPage === ADD_CONDITION && (
                  <Grid container className={classes.addSection} direction='row' spacing={40}>
                    <Grid item>
                      <BodyPart size='large' selectedIds={selectedBody} focusId={currentRoot} />
                    </Grid>
                    <Grid item className={classes.flowSection}>
                      <Grid container direction='column' spacing={8}>
                        <Grid item>
                          <Typography className={classes.title}>
                            (Optional) Add a condition
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography className={classes.label}>
                            If you have detected a chronic medical condition or a health problem that will take some time to heal, add it here.
                          </Typography>
                        </Grid>
                        <Grid item className={classes.newSection}>
                          <Grid container alignItems='center' justify='flex-end'>
                            <AddCircleOutlined className={classes.addIcon} />
                            <Typography className={classes.newText}>
                              NEW CONDITION
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid item>
                          <Grid container alignItems='center'>
                            <Typography className={classes.inputText}>
                              Name
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid item>
                          <Grid container alignItems='center' justify='space-between'>
                            <Grid item className={classes.inputSection}>
                              <input className={classes.input} value={newCondition} onChange={this.handleChangeCondition} />
                            </Grid>
                            <Grid item>
                              <img src={CheckImg} className={classes.imageIcon} alt='check_icon' onClick={this.addCondition} />
                            </Grid>
                          </Grid>
                        </Grid>
                        {conditions.length > 0 && (
                          <React.Fragment>
                            <Grid item>
                              <Divider className={classes.divider} />
                            </Grid>
                            {conditions.map((value, index) => (
                              <Grid item container direction='row' justify='space-between' alignItems='center' key={index}>
                                <Grid item>
                                  <Typography className={classes.conditionText}>
                                    {value}
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <img src={RedEditImg} className={classes.imageIcon} alt='RedEditImg' />
                                  <img src={DeleteImg} className={classes.imageIcon} alt='delete_icon' />
                                </Grid>
                              </Grid>
                            ))}
                          </React.Fragment>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                )}
                {currentPage === ANSWER_QUESTION && (
                  <Grid container className={classes.addSection} direction='row' spacing={40}>
                    <Grid item>
                      <BodyPart size='large' selectedIds={selectedBody} focusId={currentRoot} />
                    </Grid>
                    <Grid item className={classes.flowSection}>
                      <Grid container>
                        <Grid item container alignItems='center'>
                          <Grid item container className={classes.questionNum} alignItems='center' justify='center'>
                            1
                          </Grid>
                          <Grid item className={classes.questionSection}>
                            <Typography className={classes.question}>
                              Did the worker loss of consciousness?
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid item container justify='flex-end' className={classes.iconSection}>
                          <Grid item className={classes.questionSection} container direction='row'>
                            <Grid container className={classes.grayIconBox} justify='center' alignItems='center' direction='column'>
                              <img src={CheckLineImg} alt='check_icon' />
                              <Typography className='iconText'>
                                Yes
                              </Typography>
                            </Grid>
                            <Grid container className={classes.redIconBox} justify='center' alignItems='center' direction='column'>
                              <img src={CloseLineImg} alt='close_icon' />
                              <Typography className='iconText'>
                                No
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                )}
                <Grid container justify='space-between' direction='row-reverse'>
                  <Grid item>
                    <Button variant='contained' color='primary' disabled={!nextEnable} className={classes.button} onClick={this.handlePageFlow(true)}>
                      {literals.next}
                    </Button>
                  </Grid>
                  {currentPage !== -1 && (
                    <Grid item>
                      <Button variant='contained' color='secondary' className={classes.button} onClick={this.handlePageFlow(false)}>
                        {literals.previous}
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </React.Fragment>
        )}
        {currentPage === SAVE_DIAGNOSIS && (
          <Diagnosis />
        )}
      </div>
    );
  }
}

export default withStyles(styles)(DiagnosticsNewPageComponents);
