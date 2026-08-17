# ==============================================================================
# InfraGraph Sample — Terraform AWS Architecture (.tf)
# ==============================================================================

provider "aws" {
  region = "us-east-1"
}

# 1. Redes & Segurança
resource "aws_vpc" "main_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true

  tags = {
    Name = "production-vpc"
  }
}

resource "aws_security_group" "web_sg" {
  name        = "web-security-group"
  description = "Permite tráfego HTTP/HTTPS público"
  vpc_id      = aws_vpc.main_vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 2. Compute (Servidores Web & Load Balancer)
resource "aws_lb" "application_alb" {
  name               = "app-load-balancer"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.web_sg.id]

  tags = {
    Environment = "production"
  }
}

resource "aws_instance" "web_server" {
  ami             = "ami-0c55b159cbfafe1f0"
  instance_type   = "t3.medium"
  security_groups = [aws_security_group.web_sg.name]

  tags = {
    Name = "web-app-instance"
  }
}

# 3. Banco de Dados (PostgreSQL RDS)
resource "aws_db_instance" "postgres_db" {
  allocated_storage   = 20
  engine              = "postgres"
  engine_version      = "15.3"
  instance_class      = "db.t3.micro"
  db_name             = "production_db"
  username            = "dbadmin"
  password            = "SuperSecretPass123!"
  skip_final_snapshot = true

  tags = {
    Name = "rds-postgres-primary"
  }
}

# 4. Cache (ElastiCache Redis)
resource "aws_elasticache_cluster" "redis_cache" {
  cluster_id           = "redis-cache-cluster"
  engine               = "redis"
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379
}

# 5. Storage (S3 Bucket de Mídia)
resource "aws_s3_bucket" "media_assets" {
  bucket = "app-media-assets-prod-2026"

  tags = {
    Environment = "production"
  }
}
