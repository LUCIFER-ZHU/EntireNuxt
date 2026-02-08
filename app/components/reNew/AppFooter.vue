<template>
  <footer class="app-footer" :class="{ 'is-mobile': isMobile }">
    <!-- 主要链接列 -->
    <div class="footer-links-section">
      <div class="footer-content">
        <div class="footer-columns">
          <!-- Get support -->
          <div class="footer-column">
            <h3 class="footer-column-title">Get support</h3>
            <ul class="footer-links">
              <li><a href="#" class="footer-link">Help Center</a></li>
              <li><a href="#" class="footer-link">Live chat</a></li>
              <li><a href="#" class="footer-link">Check order status</a></li>
              <li><a href="#" class="footer-link">Refunds</a></li>
              <li><a href="#" class="footer-link">Report abuse</a></li>
            </ul>
          </div>

          <!-- Payments and protections -->
          <div class="footer-column">
            <h3 class="footer-column-title">Payments and protections</h3>
            <ul class="footer-links">
              <li><a href="#" class="footer-link">Safe and easy payments</a></li>
              <li><a href="#" class="footer-link">Money-back policy</a></li>
              <li><a href="#" class="footer-link">On-time shipping</a></li>
              <li><a href="#" class="footer-link">After-sales protections</a></li>
              <li><a href="#" class="footer-link">Product monitoring services</a></li>
            </ul>
          </div>

          <!-- Source on UsedUltra.com -->
          <div class="footer-column">
            <h3 class="footer-column-title">Source on UsedUltra.com</h3>
            <ul class="footer-links">
              <li><a href="#" class="footer-link">Request for Quotation</a></li>
              <li><a href="#" class="footer-link">Membership program</a></li>
              <li><a href="#" class="footer-link">Sales tax and VAT</a></li>
              <li><a href="#" class="footer-link">UsedUltra.com Reads</a></li>
            </ul>
          </div>

          <!-- Sell on UsedUltra.com -->
          <div class="footer-column">
            <h3 class="footer-column-title">Sell on UsedUltra.com</h3>
            <ul class="footer-links">
              <li><a href="#" class="footer-link">Start selling</a></li>
              <li><a href="#" class="footer-link">Seller Central</a></li>
              <li><a href="#" class="footer-link">Become a Verified Supplier</a></li>
              <li><a href="#" class="footer-link">Partnerships</a></li>
              <li><a href="#" class="footer-link">Download the app for suppliers</a></li>
            </ul>
          </div>

          <!-- Get to know us -->
          <div class="footer-column">
            <h3 class="footer-column-title">Get to know us</h3>
            <ul class="footer-links">
              <li><a href="#" class="footer-link">About UsedUltra.com</a></li>
              <li><a href="#" class="footer-link">Corporate responsibility</a></li>
              <li><a href="#" class="footer-link">News center</a></li>
              <li><a href="#" class="footer-link">Careers</a></li>
            </ul>

            <!-- Stay Connected -->
            <div class="stay-connected">
              <h3 class="footer-column-title">Stay Connected</h3>
              <div class="social-icons">
                <slot name="social-icons">
                  <div class="social-icon-placeholder">
                    <NuxtImg densities="1" loading="lazy" :src="buildImageUrl('/image/stay/1.webp')" alt="icon" />
                  </div>
                  <div class="social-icon-placeholder">
                    <NuxtImg densities="1" loading="lazy" :src="buildImageUrl('/image/stay/2.webp')" alt="icon" />
                  </div>
                  <div class="social-icon-placeholder">
                    <NuxtImg densities="1" loading="lazy" :src="buildImageUrl('/image/stay/3.webp')" alt="icon" />
                  </div>
                  <div class="social-icon-placeholder">
                    <NuxtImg densities="1" loading="lazy" :src="buildImageUrl('/image/stay/4.webp')" alt="icon" />
                  </div>
                  <div class="social-icon-placeholder">
                    <NuxtImg densities="1" loading="lazy" :src="buildImageUrl('/image/stay/5.webp')" alt="icon" />
                  </div>
                </slot>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 支付和安全认证 Logo -->
    <div class="footer-payment-section">
      <div class="footer-content">
        <div class="footer-payment-logos">
          <slot name="payment-logos">
            <div class="payment-logo-placeholder">
              <NuxtImg densities="1" loading="lazy" :src="buildImageUrl('/image/bank/1.webp')" alt="icon" />
            </div>
            <div class="payment-logo-placeholder">
              <NuxtImg densities="1" loading="lazy" :src="buildImageUrl('/image/bank/2.webp')" alt="icon" />
            </div>
            <div class="payment-logo-placeholder">
              <NuxtImg densities="1" loading="lazy" :src="buildImageUrl('/image/bank/3.webp')" alt="icon" />
            </div>
            <div class="payment-logo-placeholder">
              <NuxtImg densities="1" loading="lazy" :src="buildImageUrl('/image/bank/4.webp')" alt="icon" />
            </div>
            <div class="payment-logo-placeholder">
              <NuxtImg densities="1" loading="lazy" :src="buildImageUrl('/image/bank/5.webp')" alt="icon" />
            </div>
            <div class="payment-logo-placeholder">
              <NuxtImg densities="1" loading="lazy" :src="buildImageUrl('/image/bank/6.webp')" alt="icon" />
            </div>
            <div class="payment-logo-placeholder">
              <NuxtImg densities="1" loading="lazy" :src="buildImageUrl('/image/bank/7.webp')" alt="icon" />
            </div>
            <div class="payment-logo-placeholder">
              <NuxtImg densities="1" loading="lazy" :src="buildImageUrl('/image/bank/8.webp')" alt="icon" />
            </div>
            <div class="payment-logo-placeholder">
              <NuxtImg densities="1" loading="lazy" :src="buildImageUrl('/image/bank/9.webp')" alt="icon" />
            </div>
            <div class="payment-logo-placeholder">
              <NuxtImg densities="1" loading="lazy" :src="buildImageUrl('/image/bank/10.webp')" alt="icon" />
            </div>
            <div class="payment-logo-placeholder">
              <NuxtImg densities="1" loading="lazy" :src="buildImageUrl('/image/bank/11.webp')" alt="icon" />
            </div>
            <div class="payment-logo-placeholder">
              <NuxtImg densities="1" loading="lazy" :src="buildImageUrl('/image/bank/12.webp')" alt="icon" />
            </div>
            <div class="payment-logo-placeholder">
              <NuxtImg densities="1" loading="lazy" :src="buildImageUrl('/image/bank/13.webp')" alt="icon" />
            </div>
            <div class="payment-logo-placeholder">
              <NuxtImg densities="1" loading="lazy" :src="buildImageUrl('/image/bank/14.webp')" alt="icon" />
            </div>
            <div class="payment-logo-placeholder">
              <NuxtImg densities="1" loading="lazy" :src="buildImageUrl('/image/bank/15.webp')" alt="icon" />
            </div>
            <div class="payment-logo-placeholder">
              <NuxtImg densities="1" loading="lazy" :src="buildImageUrl('/image/bank/16.webp')" alt="icon" />
            </div>
          </slot>
        </div>
      </div>
    </div>

    <!-- 版权信息 -->
    <div class="footer-copyright-section">
      <div class="footer-content">
        <div class="footer-copyright">
          <slot name="copyright">
            <div class="copyright-text">
              © 1999-2025 UsedUltra.com。版权所有：江苏民诺信息技术有限公司 增值电信业务经营许可证：浙B2-20241358 Business license verification icon GSXT
              verification icon 浙公网安备33010002000366 浙ICP备2024067534号-3
            </div>
          </slot>
        </div>
      </div>
    </div>
    <!-- 隐藏的版本显示：用于单点核验，生产环境 display none -->
    <div style="display: none">Version: {{ appVersion }}</div>    
  </footer>
</template>

<script setup lang="ts">
// 使用设备检测组合函数
const { isMobile } = useDeviceDetection()

// 使用图片URL管理composable
const { buildImageUrl } = useImageUrl();

/**
 * 运行时配置：读取应用版本号
 * 在构建时通过环境变量 APP_VERSION 注入到 runtimeConfig.public.appVersion
 */
const runtimeConfig = useRuntimeConfig();
const appVersion = computed(() => String(runtimeConfig.public.appVersion || 'dev'));
</script>

<style scoped lang="scss">
.app-footer {
  width: 100%;
  box-sizing: border-box;
  border-top: 1px solid #e5e7eb;

  .footer-content {
    max-width: 100%;
    margin: 0 auto;
    width: 100%;
    padding: 0 12.0833vw;
  }

  .footer-links-section {
    background-color: #ffffff;
    padding: 4.1667vw 0;
  }

  .footer-columns {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 2.0833vw;
    margin-bottom: 3.125vw;

    @media (max-width: 1400px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 1024px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .footer-column {
    .footer-column-title {
      font-size: clamp(14px, .8333vw, 16px);
      font-weight: 700;
      color: #000000;
      margin-bottom: 1.25vw;
    }

    .footer-links {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        margin-bottom: 0.8333vw;

        &:last-child {
          margin-bottom: 0;
        }
      }

      .footer-link {
        font-size: clamp(12px, .625vw, 12px);
        color: #666666;
        text-decoration: none;
        transition: color 0.3s ease;
        display: block;
        line-height: 1.5;

        &:hover {
          color: $primary-color;
          text-decoration: underline;
        }

        &:focus {
          outline: 2px solid $primary-color;
          outline-offset: 2px;
          border-radius: 0.2083vw;
        }

        &:active {
          color: #051447;
        }
      }
    }

    .stay-connected {
      margin-top: 2.0833vw;

      .footer-column-title {
        margin-bottom: 1.0417vw;
      }

      .social-icons {
        display: flex;
        gap: 0.8333vw;
        flex-wrap: wrap;
        margin-top: 1.0417vw;
        align-items: center;

        .social-icon-placeholder {
          transition: all 0.3s ease;

          &:hover {
            transform: translateY(-0.1042vw);
          }

        }
      }
    }
  }

  .footer-payment-section {
    background-color: #ffffff;
    padding: 0 0 2.0833vw;
  }

  .footer-payment-logos {
    display: flex;
    flex-wrap: wrap;
    gap: .5208vw;
    align-items: center;
    justify-content: flex-start;

    .payment-logo-placeholder {
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-0.1042vw);
      }
    }
  }

  .footer-copyright-section {
    background-color: #f9f9f9;
    padding: 1.5625vw 0;
    border-top: 1px solid #e5e7eb;
  }

  .footer-copyright {

    .copyright-text {
      text-align: center;
      font-size: clamp(10px, 0.7292vw, 12px);
      color: #666666;
      white-space: normal;
      word-wrap: break-word;

      .verification-icon-placeholder {
        display: inline-block;
        width: 1.25vw;
        height: 1.25vw;
        border: 1px solid #d1d5db;
        border-radius: 0.2083vw;
        background-color: #f9fafb;
        vertical-align: middle;
        margin: 0 0.2083vw;
      }
    }
  }

  /* ------------------------------------Mobile样式----------------------------*/
  &.is-mobile {
    .footer-content {
      padding: 0 5.3333vw;
    }

    .footer-links-section {
      padding: 8.5333vw 0;
    }

    .footer-columns {
      grid-template-columns: repeat(2, 1fr);
      gap: 5.3333vw;
    }

    .footer-column {
      .footer-column-title {
        font-size: clamp(12px, 3.2vw, 16px);
        margin-bottom: 3.2vw;
      }

      .footer-links {
        li {
          margin-bottom: 2.1333vw;

          &:last-child {
            margin-bottom: 0;
          }
        }

        .footer-link {
          font-size: clamp(11px, 2.6667vw, 14px);

          &:focus {
            outline-offset: 1px;
            border-radius: 0.5333vw;
          }
        }
      }

      .stay-connected {
        margin-top: 5.3333vw;

        .footer-column-title {
          margin-bottom: 2.6667vw;
        }

        .social-icons {
          gap: 2.1333vw;
          margin-top: 2.6667vw;
          align-items: center;

          .social-icon-placeholder {
            width: 5.3333vw;
            height: 5.3333vw;
            border-radius: 1.0667vw;
          }
        }
      }
    }

    .footer-payment-section {
      padding: 5.3333vw 0;
    }

    .footer-payment-logos {
      gap: 2.6667vw;

      .payment-logo-placeholder {
        width: 10.6667vw;
        height: 6.6667vw;
        border-radius: 1.0667vw;
      }
    }

    .footer-copyright-section {
      padding: 5.3333vw 0;
    }

    .footer-copyright {

      .copyright-text {
        font-size: clamp(10px, 2.4vw, 12px);
        line-height: 1.8;

        .verification-icon-placeholder {
          width: 3.2vw;
          height: 3.2vw;
          border-radius: 0.5333vw;
          margin: 0 0.5333vw;
        }
      }
    }
  }
}
</style>
