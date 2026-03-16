# DiT Super-Resolution: Strawberry Image Enhancement

**Adapting Facebook's Diffusion Transformer (DiT) architecture for 64x64 to 128x128 image super-resolution, trained on a strawberry ripeness dataset with augmentation comparison.**



## Project Overview

This project takes the [Diffusion Transformer (DiT)](https://github.com/facebookresearch/DiT) architecture from Facebook Research and adapts it for a practical computer vision task: image super-resolution. Given a low-resolution 64x64 strawberry image, the model generates a 128x128 high-resolution version using an iterative diffusion-based denoising process.

The project also compares model performance when trained with vs. without data augmentation, providing insights into how augmentation affects diffusion model generalization on a small dataset.

### Key highlights

- Extracted and adapted the DiT architecture from [facebookresearch/DiT](https://github.com/facebookresearch/DiT)
- Replaced class-conditional generation with image-conditional super-resolution
- Implemented a complete Gaussian diffusion pipeline (cosine schedule, 1000 timesteps)
- Built a PyTorch dataloader with configurable augmentation for the [Kaggle strawberry dataset](https://www.kaggle.com/datasets/mahyeks/multi-class-strawberry-ripeness-detection-dataset)
- Trained and compared two models under identical conditions, varying only augmentation

## Architecture

The original DiT is a class-conditional latent diffusion model that generates images from class labels (e.g., "dog", "car"). We adapted it for super-resolution by making the following changes:

| Component | Original DiT | This Project |
|--|-|-|
| Conditioning | Class label (integer lookup) | 64x64 image (CNN encoder) |
| Input | Noisy latent 32×32×4 | Noisy RGB 128x128×3 |
| Output | Predicted noise in latent space | Predicted noise in pixel space |
| Scale | DiT-XL (675M params) | DiT-S (34.3M params) |
| VAE | Required | Not needed |

### What was preserved from the original DiT

- `DiTBlock` with adaLN-Zero conditioning (the core innovation)
- `TimestepEmbedder` with sinusoidal encoding
- `FinalLayer` with adaLN modulation
- 2D sine-cosine positional embeddings
- Zero-initialization of adaLN layers for training stability
- `modulate()` function and weight initialization strategy

### Architecture diagram

The model processes three inputs simultaneously. The noisy 128x128 image is split into 1024 patch tokens via PatchEmbed, with positional embeddings added. The 64x64 low-resolution image passes through a LowResEncoder (CNN) to produce a 384-dimensional conditioning vector. The timestep passes through the TimestepEmbedder (sinusoidal encoding plus MLP) to produce another 384-dimensional vector. These two vectors are summed to form the combined conditioning signal, which modulates all 12 DiT transformer blocks via adaLN-Zero. The FinalLayer projects the tokens back to pixel space, and unpatchify reconstructs the 128x128 predicted noise output.

## Dataset

[Multi-Class Strawberry Ripeness Detection Dataset](https://www.kaggle.com/datasets/mahyeks/multi-class-strawberry-ripeness-detection-dataset) (Kaggle, ~40MB)

- 566 images of strawberries at various ripeness stages
- Split: 452 train / 56 validation / 58 test
- Images resized to 128x128 (HR target) and 64x64 (LR input) using Lanczos and bicubic interpolation
- Ripeness class labels not used (super-resolution is class-agnostic)

## Data Augmentation

Two identical models trained on the same split, differing only in augmentation:

**With augmentation (training set only):**
- Random horizontal flip (50%)
- Random vertical flip (50%)
- Random rotation (0°, 90°, 180°, 270°)
- Color jitter on LR input only (brightness, contrast, saturation, hue)

Spatial transforms applied identically to both LR and HR to maintain alignment. Validation and test sets always use no augmentation.

## Results

| Metric | With Augmentation | Without Augmentation |
|--|:-:|:-:|
| Test PSNR (dB) | 6.04 | 6.08 |
| Test SSIM | 0.0117 | 0.0095 |
| Best Val Loss | 0.0564 | 0.0584 |

**Conclusion:** Mixed results. PSNR was marginally better without augmentation while SSIM favored the augmented model. The differences are small, suggesting augmentation had minimal impact at this training scale.

### Training configuration

- Model: DiT-S (34.3M parameters)
- Epochs: 20
- Batch size: 8
- Learning rate: 1e-4 (AdamW, no weight decay)
- Diffusion: 1000 timesteps, cosine schedule
- Inference: 50 denoising steps
- Hardware: NVIDIA Tesla T4 (Google Colab)
- Training time: ~14 minutes per model

## Limitations & Future Work

The PSNR (~6 dB) and SSIM (~0.01) scores are below typical super-resolution benchmarks (25-35 dB PSNR, 0.7-0.95 SSIM). This is expected and attributable to:

1. **Small dataset (566 images):** Diffusion models are data-hungry and typically train on thousands to millions of images
2. **Limited training (20 epochs):** The original DiT trained for hundreds of thousands of iterations on ImageNet
3. **Pixel-space diffusion:** The original DiT operates in VAE latent space, which is more efficient; our pixel-space approach requires more capacity
4. **Small model scale:** DiT-S (34.3M) vs the original DiT-XL (675M parameters)

**Potential improvements:**
- Train for significantly more epochs (200+) or use a learning rate scheduler
- Use a pretrained VAE encoder/decoder to work in latent space (matching the original DiT design)
- Augment the dataset with additional strawberry or general produce images
- Scale up to DiT-B (768 hidden, 12 heads) if compute allows
- Implement DDIM sampling for faster, higher-quality inference

## Project Structure

```
├ DiT Model.ipynb    # Complete Colab notebook (code + results)
├ README.md                 # This file
└ report.pdf                # Formal writeup with analysis
```

## How to Run

1. Open `DiT Model` in Google Colab
2. Set runtime to GPU (Runtime  to  Change runtime type  to  T4)
3. Run Cell 1 to upload the Kaggle dataset zip
4. Run remaining cells sequentially

## References

```
@article{Peebles2022DiT,
  title={Scalable Diffusion Models with Transformers},
  author={William Peebles and Saining Xie},
  year={2022},
  journal={arXiv preprint arXiv:2212.09748},
}
```

Dataset: Yurdakul, M., Baştuğ, Z. S., Gök, A. E., & Taşdemir, Ş. "A Novel Public Dataset for Strawberry Ripeness Detection and Comparative Evaluation of YOLO-Based Models."
