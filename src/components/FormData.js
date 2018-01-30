import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormGroup,
         InputGroup,
         FormControl,
         Glyphicon,
         Button,
         ButtonToolbar,
         Badge,
         ControlLabel,
         Row,
         Col,
         Grid,
         Modal,
         Popover,
         OverlayTrigger,
} from 'react-bootstrap';
import Switch from 'react-bootstrap-switch';
import _ from 'lodash';

import ResetCom from './ResetCom';
import { changeFaseProp, changeIngProp, changeBaseProp } from '../actions/calcActions';
import pasosTool from '../data/steps.json';
import './FormData.css';

const initialIngrediente = {
  id: 0,
  nombre: '',
  inci: '',
  funcion: '',
  porcentaje: 0,
  gramos: 0,
};
// const initialFase = {
//   id: 0,
//   ingrediente: { ...initialIngrediente },
//   porcentajeFase: 0,
//   gramosFase: 0,
// }

class FormData extends Component {
  state = {
    enableGramos: true,
    showIng: false,
    showFase: false,
    faseSel: 0,
    ingSel: 0,
  }

  handleAddIngrediente = (faseIndex, ingredienteIndex) => {
    const { fase } = this.props;
    const { ingrediente } = fase[faseIndex];
    const newIngrediente = {
      id: ingrediente.length,
      nombre: '',
      inci: '',
      funcion: '',
      porcentaje: 0,
      gramos: 0,
    };
    ingrediente[parseInt(ingredienteIndex, 10) + 1] = newIngrediente;
    this.props.changeFaseProp({ fase: faseIndex, prop: 'ingrediente', value: ingrediente})
  }

  handleAddFase = (faseIndex) => {
    const { fase } = this.props;
    const newFase = {
      id: Object.keys(fase).length,
      ingrediente: { 0: initialIngrediente },
      porcentajeFase: 0,
      gramosFase: 0,
    }
    fase[parseInt(faseIndex, 10)+1] = newFase;
    this.props.changeBaseProp({ prop: 'fase', value: fase });
  }

  handleDeleteIngrediente = (faseIndex, ingredienteIndex) => {
    const { fase } = this.props;
    let { ingrediente } = fase[faseIndex];
    delete ingrediente[ingredienteIndex];
    let i = 0
    ingrediente = _.mapKeys(ingrediente, function(value, key) {
      return i++;
    });

    if (!Object.keys(ingrediente).length) {
      const newIngrediente = {
        id: 0,
        nombre: '',
        inci: '',
        funcion: '',
        porcentaje: 0,
        gramos: 0,
      };
      ingrediente[0] = newIngrediente;
    }
    this.props.changeFaseProp({ fase: faseIndex, prop: 'ingrediente', value: ingrediente});
    this.setState({ showIng: false })
  }

  handleDeleteFase = (faseIndex) => {
    let { fase } = this.props;
    delete fase[faseIndex];
    let i = 0;
    fase =  _.mapKeys(fase, function(value, key) {
      return i++;
    });

    if (!Object.keys(fase).length) {
      const newFase = {
        id: 0,
        ingrediente: { 0: initialIngrediente },
        porcentajeFase: 0,
        gramosFase: 0,
      }
      fase[0] = newFase;
    }
    this.props.changeBaseProp({ prop: 'fase', value: fase })
    this.setState({ showFase: false })
  }

  handleBaseChange = (e) => {
    const { name, value } = e.target;
    this.props.changeBaseProp({ prop: name, value: value });
  }

  handleFaseChange = (fase, e) => {
    const { name, value } = e.target;
    this.props.changeFaseProp({ fase, prop: name, value });
  }

  handleIngChange = (fase, ingrediente, e) => {
    const { name, value } = e.target;
    this.props.changeIngProp({ fase, ingrediente, prop: name, value });
  }

  renderIngrediente({ nombre, inci, funcion, porcentaje, gramos }, ingredienteIndex, faseIndex) {
    const { fase } = this.props;
    let label = false;
    if (ingredienteIndex === 0) label = true;
    return (
      <div key={ingredienteIndex}>
        <Col xs={1} md={1}>
          {label ? (
            <div>
              <br />
              <ButtonToolbar className="pull-right first-minus-icon" >
                <Button
                  dense="true"
                  bsSize="xsmall"
                  className="button-minus"
                  onClick={() => this.handleShowModal('showIng',{ faseSel: faseIndex, ingSel: ingredienteIndex })}
                >
                  <Glyphicon glyph="minus" />
                </Button>
              </ButtonToolbar>
            </div>
          ) : (
            <ButtonToolbar className="pull-right minus-icon" >
              <Button
                dense="true"
                bsSize="xsmall"
                className="button-minus"
                onClick={() => this.handleShowModal('showIng',{ faseSel: faseIndex, ingSel: ingredienteIndex })}
              >
                <Glyphicon glyph="minus" />
              </Button>
            </ButtonToolbar>
            )}
        </Col>
        <Col xs={4.5} md={3}>
          {label ? <ControlLabel>Ingredientes</ControlLabel> : null}
          <FormGroup>
            <InputGroup>
              <InputGroup.Addon className='addon'>{ingredienteIndex+1}.</InputGroup.Addon>
              <FormControl
                className='form-data form-ingredients'
                placeholder='Nombre de ingrediente'
                type="text"
                name="nombre"
                value={nombre ? nombre : ''}
                onChange={(e) => this.handleIngChange(faseIndex, ingredienteIndex, e)}
              />
            </InputGroup>
          </FormGroup>
          {(ingredienteIndex === (Object.keys(fase[faseIndex].ingrediente).length -1)) ?
          <ButtonToolbar>
            <Button onClick={() => this.handleAddIngrediente(faseIndex, ingredienteIndex)}>
              <Glyphicon glyph="plus" /> Añadir Ingrediente
            </Button>
          </ButtonToolbar>
          : null}
        </Col>
        <Col xs={4.5} md={3}>
          {label ? <ControlLabel>INCI</ControlLabel> : null}
          <FormGroup>
            <FormControl
              className='form-data form-ingredients'
              placeholder='INCI de ingrediente'
              type="text"
              name="inci"
              value={inci ? inci : ''}
              onChange={(e) => this.handleIngChange(faseIndex, ingredienteIndex, e)}
            />
          </FormGroup>
        </Col>
        <Col xs={4.5} md={2}>
          {label ? <ControlLabel>Función</ControlLabel> : null}
          <FormGroup>
            <FormControl
              className='form-data form-ingredients'
              placeholder='Función de ingrediente'
              type="text"
              name="funcion"
              value={funcion ? funcion : ''}
              onChange={(e) => this.handleIngChange(faseIndex, ingredienteIndex, e)}
            />
          </FormGroup>
        </Col>
        <Col xs={2} md={1}>
          {label ? <ControlLabel>Porcentaje</ControlLabel> : null}
          <FormGroup validationState={this.getValidationState(porcentaje)}>
            <InputGroup>
              <FormControl
                disabled={this.state.enableGramos}
                className='form-data form-ingredients'
                placeholder=' % '
                type="text"
                name="porcentaje"
                value={porcentaje ? porcentaje : ''}
                onChange={(e) => this.handleIngChange(faseIndex, ingredienteIndex, e)}
              />
              <InputGroup.Addon className='addon'>%</InputGroup.Addon>
            </InputGroup>
          </FormGroup>
        </Col>
        <Col xs={2} md={1}>
          {label ? <ControlLabel>Gramos</ControlLabel> : null}
          <FormGroup validationState={this.getValidationState(gramos)}>
            <InputGroup>
              <FormControl
                disabled={!this.state.enableGramos}
                className='form-data form-ingredients'
                placeholder=' grs '
                type="text"
                name="gramos"
                value={gramos ? gramos : ''}
                onChange={(e) => this.handleIngChange(faseIndex, ingredienteIndex, e)}
              />
              <InputGroup.Addon className='addon'>g</InputGroup.Addon>
            </InputGroup>
          </FormGroup>
        </Col>
      </div>
    );
  }

  renderFase({ ingrediente, porcentajeFase, gramosFase }, faseIndex) {
    const { fase } = this.props;
    const length = (parseInt(Object.keys(fase).length, 10) -1);
    return(
      <div key={faseIndex}>
        <Row className="show-grid">
          <Col xs={2} md={1} className='col-fase'>
            <ControlLabel></ControlLabel>
            <FormGroup>
              <InputGroup>
                <OverlayTrigger
                  trigger={['hover', 'focus']}
                  placement="top"
                  overlay={this.renderPopover(pasosTool[2])}
                >
                  <InputGroup.Addon className='addon'><Badge>{3}</Badge></InputGroup.Addon>
                </OverlayTrigger>
                <FormControl style={{ height: 42 * Object.keys(fase[faseIndex].ingrediente).length }} className='form-data form-fase' bsSize='lg' type="text" defaultValue={'Fase '+ (faseIndex+1)} />
              </InputGroup>
            </FormGroup>
            {(length === faseIndex) ?
            <ButtonToolbar className="button-add-fase">
              <Button onClick={() => this.handleAddFase(faseIndex)}>
                <Glyphicon glyph="plus" /> Añadir Fase
              </Button>
            </ButtonToolbar>
            : null}
            <ButtonToolbar>
              <Button bsSize="xsmall" onClick={() => this.handleShowModal('showFase', { faseSel: faseIndex })}>
                <Glyphicon glyph="minus" /> Borrar Fase
              </Button>
            </ButtonToolbar>
          </Col>
        {_.map(ingrediente, (value, index) => this.renderIngrediente(value, parseInt(index, 10), faseIndex))}
        </Row>
        <Row className="show-grid">
          <Col xs={10} md={8} />
          <Col xs={4.5} md={2}>
            <div className='pull-right'>
              <ControlLabel>Total Fase {faseIndex +1}</ControlLabel>
            </div>
          </Col>
          <Col xs={2} md={1}>
            <FormGroup>
              <InputGroup>
                <FormControl
                  disabled={this.state.enableGramos}
                  className='form-data form-ingredients'
                  placeholder=' % '
                  type="text"
                  name="porcentajeFase"
                  value={porcentajeFase ? porcentajeFase : ''}
                />
                <InputGroup.Addon className='addon'>%</InputGroup.Addon>
              </InputGroup>
            </FormGroup>
          </Col>
          <Col xs={2} md={1}>
            <FormGroup>
              <InputGroup>
                <FormControl
                  disabled={!this.state.enableGramos}
                  className='form-data form-ingredients'
                  placeholder=' grs '
                  type="text"
                  name="gramosFase"
                  value={gramosFase ? gramosFase : ''}
                />
                <InputGroup.Addon className='addon'>g</InputGroup.Addon>
              </InputGroup>
            </FormGroup>
          </Col>
        </Row>
      </div>
    );
  }

  render() {
    const { enableGramos } = this.state;
    const { fase } = this.props;
    return (
      <form>
      <Grid>
        <Row>
          <Col xs={3} md={7}>
            <h1 className='title-top'>Calculadora de ingredientes</h1>
          </Col>
          <Col xs={11} md={2} />
          <Col xs={5} md={3} >
            <FormGroup>
              <Switch
                offColor={'primary'}
                onText={'Gramos'}
                offText={'Porcentaje'}
                handleWidth={100}
                labelText={enableGramos ? 'Porcentaje' : 'Gramos'}
                onChange={(el, state) => this.handleSwitch(state)}
              />
            </FormGroup>
          </Col>
        </Row>
        <br />
        <Row className="show-grid">
          <Col xs={6} md={4}>
            <ControlLabel>Datos de tu receta</ControlLabel>
            <FormGroup>
              <InputGroup>
                <OverlayTrigger
                  trigger={['hover', 'focus']}
                  placement="top"
                  overlay={this.renderPopover(pasosTool[0])}
                >
                  <InputGroup.Addon className='addon' ><Badge>1</Badge></InputGroup.Addon>
                </OverlayTrigger>
                <FormControl
                  placeholder='Nombre de tu receta'
                  className='form-data'
                  bsSize='lg'
                  type="text"
                  name="titulo"
                  value={this.props.titulo ? this.props.titulo : ''}
                  onChange={this.handleBaseChange}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <FormControl
                placeholder='Numero de referencia'
                className='form-data no-addons'
                type="text"
                name="referencia"
                value={this.props.referencia ? this.props.referencia : ''}
                onChange={this.handleBaseChange}
              />
              <FormControl
                placeholder='Fecha de producción'
                className='form-data no-addons'
                type="text"
                name="fecha"
                value={this.props.fecha ? this.props.fecha : ''}
                onChange={this.handleBaseChange}
              />
            </FormGroup>
          </Col>
          <Col xs={6} md={4} />
          <Col xsHidden md={4}>
            <ControlLabel>Tamaño total del lote en gramos</ControlLabel>
            <FormGroup>
              <InputGroup>
                <OverlayTrigger
                  trigger={['hover', 'focus']}
                  placement="top"
                  overlay={this.renderPopover(pasosTool[1])}
                >
                  <InputGroup.Addon className='addon'><Badge>2</Badge></InputGroup.Addon>
                </OverlayTrigger>
                <FormControl
                  disabled={this.state.enableGramos}
                  placeholder='Peso total en gramos'
                  className='form-data'
                  bsSize='lg'
                  type="text"
                  name="pesoTotal"
                  value={this.props.pesoTotal ? this.props.pesoTotal : ''}
                  onChange={this.handleBaseChange}
                />
                <InputGroup.Addon className='addon'>g</InputGroup.Addon>
              </InputGroup>
            </FormGroup>
          </Col>
        </Row>
        <br /><br />
        {_.map(fase, (value, index) => this.renderFase(value, parseInt(index, 10)))}
        <Row className="show-grid">
          <Col xs={10} md={8} />
          <Col xs={4.5} md={2}>
            <div className='pull-right'>
              <ControlLabel>Total Fórmula</ControlLabel>
            </div>
          </Col>
          <Col xs={2} md={1}>
            <FormGroup>
              <InputGroup>
                <FormControl
                  disabled={this.state.enableGramos}
                  className='form-data form-ingredients'
                  placeholder=' % '
                  type="text"
                  name="porcentajeTotal"
                  value={this.props.porcentajeTotal ? this.props.porcentajeTotal : ''}
                />
                <InputGroup.Addon className='addon'>%</InputGroup.Addon>
              </InputGroup>
            </FormGroup>
          </Col>
          <Col xs={2} md={1}>
            <FormGroup validationState={this.getValidationState(this.props.gramosTotal)}>
              <InputGroup>
                <FormControl
                  disabled={!this.state.enableGramos}
                  className='form-data form-ingredients'
                  placeholder=' grs '
                  type="int"
                  name="gramosTotal"
                  value={this.props.gramosTotal ? this.props.gramosTotal : ''}
                />
                <InputGroup.Addon className='addon'>g</InputGroup.Addon>
              </InputGroup>
            </FormGroup>
          </Col>
        </Row>
        <Row className="show-grid">
          <Col xs={10} md={10} />
          <Col xs={2} md={2}>
            <ButtonToolbar>
              <Button bsStyle="primary" bsSize="large">
                Exportar / Guardar
              </Button>
            </ButtonToolbar>
          </Col>
        </Row>
        <br />
        <Row className="show-grid">
          <Col xs={10} md={10} />
          <Col xs={2} md={2}>
            <ButtonToolbar>
              <ResetCom />
            </ButtonToolbar>
          </Col>
        </Row>
      </Grid>
      {this.renderConfirmFase()}
      {this.renderConfirmIngrediente()}
    	</form>
    );
  }
  getValidationState(number) {
    function isNumber(n) { return !isNaN(parseFloat(n)) && !isNaN(n - 0) }
    if (!number) return null;
    if (isNumber(number)) return null;
    return "error";
  }

  handleSwitch = (state) => {
    this.setState({ enableGramos: state });
  }

  handleHideModal = () => {
    this.setState({ showFase: false, showIng: false });
  }

  handleShowModal = (modalShow, indexFaseIng) => {
    this.setState({ [modalShow]: true, ...indexFaseIng });
  }

  renderConfirmFase = () => {
    return (
      <Modal
        show={this.state.showFase}
        onHide={this.handleHideModal}
        container={this}
        aria-labelledby="contained-modal-title"
      >
        <Modal.Body>
          ¿Seguro que deseas borrar esta fase?
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => this.handleDeleteFase(this.state.faseSel)}>Confirmar</Button>
          <Button onClick={this.handleHideModal}>Cancelar</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  renderConfirmIngrediente = () => {
    return (
      <Modal
        show={this.state.showIng}
        onHide={this.handleHideModal}
        container={this}
        aria-labelledby="contained-modal-title"
      >
        <Modal.Body>
          ¿Seguro que deseas borrar este ingrediente?
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => this.handleDeleteIngrediente(this.state.faseSel, this.state.ingSel)}>Confirmar</Button>
          <Button onClick={this.handleHideModal}>Cancelar</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  renderPopover = (pasos) => (
      <Popover id='stepsPop' title={pasos.title}>
        {pasos.text}
      </Popover>
  );
}

const mapStateToProps = ({ calc, purge }) => {
  const { fase, titulo, referencia, fecha, pesoTotal, porcentajeTotal, gramosTotal, ts } = calc;
  console.log(calc);
  return { fase, titulo, referencia, fecha, pesoTotal, porcentajeTotal, gramosTotal, ts };
}

export default connect(mapStateToProps, { changeBaseProp, changeFaseProp, changeIngProp })(FormData);
