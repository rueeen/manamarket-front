import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { api } from '../api/endpoints';
import ProductCarousel from '../components/ProductCarousel';
import ProductSlider from '../components/ProductSlider';
import { useCart } from '../hooks/useCart';
import banner1 from '../images/banner1.webp';
import banner2 from '../images/banner2.jpg';
import banner3 from '../images/banner3.webp';
import { getProductTypeValue } from '../utils/product';

const PRODUCT_TYPE_ORDER = ['bundle', 'sealed', 'single', 'accessory', 'service', 'other'];

const PRODUCT_TYPE_LABELS = {
  bundle: 'Bundles',
  sealed: 'Productos sellados',
  single: 'Cartas individuales',
  accessory: 'Accesorios',
  service: 'Servicios / encargos',
  other: 'Otros productos',
};

const groupProductsByType = (items) => {
  return items.reduce((groups, product) => {
    const type = getProductTypeValue(product) || 'other';
    if (!groups[type]) groups[type] = [];
    groups[type].push(product);
    return groups;
  }, {});
};

const getOrderedProductTypes = (groups) => {
  const knownTypes = PRODUCT_TYPE_ORDER.filter((type) => groups[type]?.length);
  const extraTypes = Object.keys(groups).filter((type) => !PRODUCT_TYPE_ORDER.includes(type));
  return [...knownTypes, ...extraTypes];
};

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addItem } = useCart();

  const availableProducts = useMemo(() => {
    return products.filter((product) => {
      return Number(product?.stock || 0) > 0 || getProductTypeValue(product) === 'service';
    });
  }, [products]);

  const groupedProducts = useMemo(() => groupProductsByType(availableProducts), [availableProducts]);
  const orderedTypes = useMemo(() => getOrderedProductTypes(groupedProducts), [groupedProducts]);

  const carouselProducts = useMemo(() => {
    return products.filter((product) => product.image).slice(0, 6);
  }, [products]);

  const loadProducts = async () => {
    setLoading(true);

    try {
      const [page1, page2] = await Promise.all([
        api.getProducts({ active: 'true', available: 'true', page: 1 }),
        api.getProducts({ active: 'true', available: 'true', page: 2 }),
      ]);

      const results1 = page1.data?.results || page1.data || [];
      const results2 = page2.data?.results || page2.data || [];

      setProducts([...results1, ...results2]);
    } catch {
      // El apiClient ya muestra el error.
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <>
      <div
        style={{
          width: '100vw',
          position: 'relative',
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw',
          marginTop: '-1.5rem',
          marginBottom: '1.5rem',
          overflow: 'hidden',
        }}
      >
        <div
          id="heroBannerSlider"
          className="carousel slide"
          data-bs-ride="carousel"
          data-bs-interval="4500"
        >
        <div className="carousel-indicators">
          {[banner1, banner2, banner3].map((_, i) => (
            <button
              key={i}
              type="button"
              data-bs-target="#heroBannerSlider"
              data-bs-slide-to={i}
              className={i === 0 ? 'active' : ''}
              aria-current={i === 0 ? 'true' : undefined}
              aria-label={`Banner ${i + 1}`}
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.6)',
              }}
            />
          ))}
        </div>

        <div className="carousel-inner">
          {[banner1, banner2, banner3].map((src, i) => (
            <div key={i} className={`carousel-item ${i === 0 ? 'active' : ''}`}>
              <img
                src={src}
                className="d-block w-100"
                alt={`Banner ${i + 1}`}
                style={{
                  height: 'clamp(200px, 35vw, 420px)',
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
              />
            </div>
          ))}
        </div>

          <button
            className="carousel-control-prev"
          type="button"
          data-bs-target="#heroBannerSlider"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true" />
          <span className="visually-hidden">Anterior</span>
          </button>

          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#heroBannerSlider"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="visually-hidden">Siguiente</span>
          </button>
        </div>
      </div>

      {/* Sección sobre nosotros */}
      <section
        style={{
          padding: '2.5rem 0 2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        {/* Quiénes somos */}
        <div className="panel-card p-4" style={{ borderLeft: '3px solid var(--color-primary)' }}>
          <div className="mb-2" style={{ fontSize: '1.4rem' }}>
            🧙
          </div>
          <h6 className="fw-bold mb-2" style={{ color: 'var(--color-primary)' }}>
            ¿Quiénes somos?
          </h6>
          <p className="text-muted mb-0" style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
            Somos una tienda de Magic: The Gathering en Arica. Llevamos años vendiendo cartones
            ilustrados con estadísticas y textos en letra microscópica. Nuestros clientes los
            coleccionan, los juegan, y a veces los lloran.
          </p>
        </div>

        {/* Qué vendemos */}
        <div className="panel-card p-4" style={{ borderLeft: '3px solid var(--color-success)' }}>
          <div className="mb-2" style={{ fontSize: '1.4rem' }}>
            📦
          </div>
          <h6 className="fw-bold mb-2" style={{ color: 'var(--color-success)' }}>
            ¿Qué vendemos?
          </h6>
          <p className="text-muted mb-0" style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
            Singles, sellados y bundles cuidadosamente seleccionados. También hacemos encargos
            especiales para cuando necesitas esa carta específica que destruirá la amistad de todos
            en la mesa.
          </p>
        </div>

        {/* Cómo funciona */}
        <div className="panel-card p-4" style={{ borderLeft: '3px solid var(--color-warning)' }}>
          <div className="mb-2" style={{ fontSize: '1.4rem' }}>
            🛒
          </div>
          <h6 className="fw-bold mb-2" style={{ color: 'var(--color-warning)' }}>
            ¿Cómo comprar?
          </h6>
          <p className="text-muted mb-0" style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
            Agrega al carrito, paga con Webpay y espera tu pedido. Simple, rápido, y con menos
            burocracia que conseguir un land cuando más lo necesitas.
          </p>
        </div>

        {/* Contacto / confianza */}
        <div className="panel-card p-4" style={{ borderLeft: '3px solid var(--color-blue)' }}>
          <div className="mb-2" style={{ fontSize: '1.4rem' }}>
            📬
          </div>
          <h6 className="fw-bold mb-2" style={{ color: 'var(--color-blue-soft)' }}>
            Confianza garantizada
          </h6>
          <p className="text-muted mb-0" style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
            Stock real, precios en CLP y seguimiento de tu pedido. Porque ya es suficientemente
            doloroso perder en torneo — no necesitas también perder tu plata.
          </p>
        </div>
      </section>

      {loading ? (
        <div
          style={{ minHeight: 'calc(100vh - 520px)' }}
          className="d-flex align-items-center justify-content-center"
        >
          <div className="text-center text-muted">
            <div className="spinner-border spinner-border-sm mb-2 d-block mx-auto" role="status" />
            Cargando productos destacados...
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="panel-card p-4 text-center text-muted">
          Aún no hay productos activos en el catálogo.
        </div>
      ) : (
        <>
          {carouselProducts.length > 0 && (
            <div className="mb-4">
              <ProductCarousel products={carouselProducts} />
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
            <div>
              <h3 className="mb-1">Destacados por categoría</h3>
              <p className="text-muted mb-0">
                Priorizamos bundles y productos sellados para compra inmediata.
              </p>
            </div>

            <Link to="/catalogo" className="btn btn-outline-primary">
              Ver todos
            </Link>
          </div>

          {orderedTypes.length > 0 ? (
            <div className="catalog-sections">
              {orderedTypes.map((sectionType) => (
                <section key={sectionType} className="catalog-section">
                  <div className="catalog-section-header">
                    <div>
                      <h3 className="mb-1">{PRODUCT_TYPE_LABELS[sectionType] || sectionType}</h3>
                      <p className="text-muted mb-0">
                        {groupedProducts[sectionType].length} producto(s) disponibles
                      </p>
                    </div>

                    <Link to={`/catalogo?type=${sectionType}`} className="btn btn-outline-primary btn-sm">
                      Ver sección
                    </Link>
                  </div>

                  <ProductSlider
                    products={groupedProducts[sectionType].slice(
                      0,
                      sectionType === 'bundle' || sectionType === 'sealed' ? 6 : 8,
                    )}
                    onAdd={addItem}
                    variant={sectionType}
                  />
                </section>
              ))}
            </div>
          ) : (
            <div className="panel-card p-4 text-center text-muted">
              No hay productos con stock disponible por ahora.
            </div>
          )}
        </>
      )}
    </>
  );
}
