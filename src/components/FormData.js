import React, { Component } from 'react';
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
const initialFase = {
  id: 0,
  ingrediente: [{ ...initialIngrediente }],
  porcentajeFase: 0,
  gramosFase: 0,
}

class FormData extends Component {
  state = {
    enableGramos: true,
    showIng: false,
    showFase: false,
    faseSel: 0,
    ingSel: 0,
    fase: [{ ...initialFase }],
    formulaTotal: {
      porcentaje: 0,
      gramos: 0,
    }
  }

  handleAddIngrediente = (faseIndex, ingredienteIndex) => {
    const { fase } = this.state;
    const { ingrediente } = fase[faseIndex];
    const newIngrediente = {
      id: ingrediente.length,
      nombre: '',
      inci: '',
      funcion: '',
      porcentaje: 0,
      gramos: 0,
    };
    fase[faseIndex].ingrediente.push(newIngrediente);
    this.setState({ fase })
  }

  handleAddFase = (faseIndex) => {
    const { fase } = this.state;
    const newFase = {
      id: fase.length,
      ingrediente: [{ ...initialIngrediente }],
      porcentajeFase: 0,
      gramosFase: 0,
    }
    fase.push(newFase);
    this.setState({ fase })
  }

  handleDeleteIngrediente = (faseIndex, ingredienteIndex) => {
    const { fase } = this.state;
    fase[faseIndex].ingrediente.splice(ingredienteIndex, 1);
    if (!fase[faseIndex].ingrediente.length) {
      const newIngrediente = {
        id: 0,
        nombre: '',
        inci: '',
        funcion: '',
        porcentaje: 0,
        gramos: 0,
      };
      fase[faseIndex].ingrediente.push(newIngrediente);
    }
    this.setState({ fase, showIng: false })
  }

  handleDeleteFase = (faseIndex) => {
    const { fase } = this.state;
    fase.splice(faseIndex, 1);
    if (!fase.length) {
      const newFase = {
        id: 0,
        ingrediente: [{ ...initialIngrediente }],
        porcentajeFase: 0,
        gramosFase: 0,
      }
      fase.push(newFase);
    }
    this.setState({ fase, showFase: false })
  }

  renderIngrediente(ingrediente, ingredienteIndex, faseIndex) {
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
                  onClick={() => this.handleDeleteIngrediente(faseIndex, ingredienteIndex)}
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
              <FormControl className='form-data form-ingredients' placeholder='Nombre de ingrediente' type="text" />
            </InputGroup>
          </FormGroup>
          {(ingredienteIndex === (this.state.fase[faseIndex].ingrediente.length -1)) ?
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
            <FormControl className='form-data form-ingredients' placeholder='INCI de ingrediente' type="text" />
          </FormGroup>
        </Col>
        <Col xs={4.5} md={2}>
          {label ? <ControlLabel>Función</ControlLabel> : null}
          <FormGroup>
            <FormControl className='form-data form-ingredients' placeholder='Función de ingrediente' type="text" />
          </FormGroup>
        </Col>
        <Col xs={2} md={1}>
          {label ? <ControlLabel>Porcentaje</ControlLabel> : null}
          <FormGroup>
            <InputGroup>
              <FormControl disabled={this.state.enableGramos} className='form-data form-ingredients' placeholder=' % ' type="text" />
              <InputGroup.Addon className='addon'>%</InputGroup.Addon>
            </InputGroup>
          </FormGroup>
        </Col>
        <Col xs={2} md={1}>
          {label ? <ControlLabel>Gramos</ControlLabel> : null}
          <FormGroup>
            <InputGroup>
              <FormControl disabled={!this.state.enableGramos} className='form-data form-ingredients' placeholder=' grs ' type="text" />
              <InputGroup.Addon className='addon'>g</InputGroup.Addon>
            </InputGroup>
          </FormGroup>
        </Col>
      </div>
    );
  }

  renderFase(fase, faseIndex) {
    const { ingrediente } = fase;
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
                <FormControl style={{ height: 42 * ingrediente.length }} className='form-data form-fase' bsSize='lg' type="text" defaultValue={'Fase '+ (faseIndex+1)} />
              </InputGroup>
            </FormGroup>
            {(faseIndex === (this.state.fase.length -1)) ?
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
        {ingrediente.map((value, index) => this.renderIngrediente(value, index, faseIndex))}
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
                <FormControl disabled={this.state.enableGramos} className='form-data form-ingredients' placeholder=' % ' type="text" />
                <InputGroup.Addon className='addon'>%</InputGroup.Addon>
              </InputGroup>
            </FormGroup>
          </Col>
          <Col xs={2} md={1}>
            <FormGroup>
              <InputGroup>
                <FormControl disabled={!this.state.enableGramos} className='form-data form-ingredients' placeholder=' grs ' type="text" />
                <InputGroup.Addon className='addon'>g</InputGroup.Addon>
              </InputGroup>
            </FormGroup>
          </Col>
        </Row>
      </div>
    );
  }

  render() {
    const { fase, enableGramos } = this.state;
    console.log(this.state);
    return (
      <form>
      <Grid>
        <Row>
          <Col xs={3} md={7}>
            <h1 className='title-top'>Calculadora de recetas</h1>
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
                <FormControl placeholder='Nombre de tu receta' className='form-data' bsSize='lg' type="text" />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <FormControl placeholder='Numero de referencia' className='form-data no-addons' type="text" />
              <FormControl placeholder='Fecha de producción' className='form-data no-addons' type="text" />
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
                <FormControl placeholder='Peso total en gramos' className='form-data' bsSize='lg' type="text" />
              </InputGroup>
            </FormGroup>
          </Col>
        </Row>
        <br /><br />
        {fase.map((value, index) => this.renderFase(value, index))}
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
                <FormControl disabled={this.state.enableGramos} className='form-data form-ingredients' placeholder=' % ' type="text" />
                <InputGroup.Addon className='addon'>%</InputGroup.Addon>
              </InputGroup>
            </FormGroup>
          </Col>
          <Col xs={2} md={1}>
            <FormGroup>
              <InputGroup>
                <FormControl disabled={!this.state.enableGramos} className='form-data form-ingredients' placeholder=' grs ' type="text" />
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
              <Button>
                Borrar
              </Button>
            </ButtonToolbar>
          </Col>
        </Row>
      </Grid>
      {this.renderConfirmFase()}
      {this.renderConfirmIngrediente()}
    	</form>
    );
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

export default FormData;
