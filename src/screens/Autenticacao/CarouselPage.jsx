import React from 'react'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { Col } from 'reactstrap'

// img
import authOverlay from '../../assets/images/bg-auth-overlay.png'

const CarouselPage = () => {
  return (
    <React.Fragment>
      <Col xl={9}>
        <div className="auth-full-bg pt-lg-5 p-4">
          <div className="w-100">
            <div
              className="bg-overlay"
              style={{
                background: `url(${authOverlay})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }}
            ></div>
            <div className="d-flex h-100 flex-column">
              <div className="p-4 mt-auto">
                <div className="row justify-content-center">
                  <div className="col-lg-7">
                    <div className="text-center">
                      <h4 className="mb-3">
                        <i className="bx bxs-quote-alt-left text-primary h1 align-middle me-3"></i>
                        <span className="text-primary">5k</span>+ Clientes
                        Satisfeitos
                      </h4>
                      <div dir="ltr">
                        <Carousel
                          className="owl-carousel owl-theme auth-review-carousel slider_css"
                          id="auth-review-carousel"
                          showThumbs={false}
                        >
                          <div>
                            <div className="item">
                              <div className="pb-5 pt-3">
                                <p className="font-size-16 mb-4">
                                  &quot;A 7Stratos transformou nossa maneira de
                                  prospectar e converter leads. A automação e
                                  personalização proporcionadas pela plataforma
                                  são incríveis. Nossa eficiência aumentou
                                  significativamente!&quot;
                                </p>

                                <div>
                                  <h4 className="font-size-16 text-primary">
                                    João Silva
                                  </h4>
                                  <p className="font-size-14 mb-0">
                                    - Usuário da 7Stratos
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="item">
                              <div className="pb-5 pt-3">
                                <p className="font-size-16 mb-4">
                                  &quot;Com a 7Stratos, nossa equipe de vendas
                                  agora consegue realizar mais de 70 atividades
                                  por dia, tornando nosso processo de conversão
                                  muito mais eficiente e organizado.&quot;
                                </p>

                                <div>
                                  <h4 className="font-size-16 text-primary">
                                    Maria Oliveira
                                  </h4>
                                  <p className="font-size-14 mb-0">
                                    - Usuária da 7Stratos
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="item">
                              <div className="pb-5 pt-3">
                                <p className="font-size-16 mb-4">
                                  &quot;Os insights fornecidos pela 7Stratos são
                                  valiosíssimos. Conseguimos otimizar nossas
                                  campanhas e melhorar o desempenho da equipe
                                  com base nas análises detalhadas da
                                  plataforma.&quot;
                                </p>

                                <div>
                                  <h4 className="font-size-16 text-primary">
                                    Carlos Pereira
                                  </h4>
                                  <p className="font-size-14 mb-0">
                                    - Usuário da 7Stratos
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="item">
                              <div className="pb-5 pt-3">
                                <p className="font-size-16 mb-4">
                                  &quot;A integração fácil e rápida com nosso
                                  CRM tornou o uso da 7Stratos ainda mais
                                  eficaz. Recomendo fortemente para qualquer
                                  equipe de vendas que deseja aumentar sua
                                  produtividade.&quot;
                                </p>

                                <div>
                                  <h4 className="font-size-16 text-primary">
                                    Ana Souza
                                  </h4>
                                  <p className="font-size-14 mb-0">
                                    - Usuária da 7Stratos
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Carousel>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Col>
    </React.Fragment>
  )
}
export default CarouselPage
