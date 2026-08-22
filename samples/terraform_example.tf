# ==============================================================================
# InfraGraph Sample — Terraform AWS Architecture (.tf)
# ==============================================================================

provider "aws" {
  region = "us-east-1"
}

# ------------------------------------------------------------------------------
# 1. VPC & Security Group
# ------------------------------------------------------------------------------
resource "aws_vpc" "main_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  tags = {
    Name = "production-vpc"
  }
}

resource "aws_security_group" "web_sg" {
  name        = "web-security-group"
  description = "Allow public HTTP/HTTPS traffic"
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

# ------------------------------------------------------------------------------
# 2. Compute – EC2 instance + Application Load Balancer
# ------------------------------------------------------------------------------
resource "aws_lb" "app_alb" {
  name               = "app-load-balancer"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.web_sg.id]
  tags = {
    Environment = "production"
  }
}

resource "aws_instance" "web_server" {
  ami           = "ami-0c55b159cbfafe1f0"  # Amazon Linux 2 (us-east-1)
  instance_type = "t3.medium"
  security_groups = [aws_security_group.web_sg.name]
  tags = {
    Name = "web-app-instance"
  }
}

# ------------------------------------------------------------------------------
# 3. Database – Amazon RDS PostgreSQL
# ------------------------------------------------------------------------------
resource "aws_db_instance" "postgres_db" {
  allocated_storage   = 20
  engine              = "postgres"
  engine_version      = "15.3"
  instance_class      = "db.t3.micro"
  db_name             = "production_db"
  username            = "dbadmin"
  password            = "SuperSecretPass123!"
  skip_final_snapshot = true
  vpc_security_group_ids = [aws_security_group.web_sg.id]
  tags = {
    Name = "rds-postgres-primary"
  }
}

# ------------------------------------------------------------------------------
# 4. Cache – ElastiCache Redis cluster
# ------------------------------------------------------------------------------
resource "aws_elasticache_cluster" "redis_cache" {
  cluster_id           = "redis-cache-cluster"
  engine               = "redis"
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379
  subnet_group_name    = "default"
}

# ------------------------------------------------------------------------------
# 5. Storage – S3 bucket for static assets
# ------------------------------------------------------------------------------
resource "aws_s3_bucket" "media_assets" {
  bucket = "app-media-assets-prod-2026"
  tags = {
    Environment = "production"
  }
}

# ------------------------------------------------------------------------------
# Outputs (optional – useful for the UI to reference resources)
# ------------------------------------------------------------------------------
output "vpc_id" {
  value = aws_vpc.main_vpc.id
}
output "alb_dns_name" {
  value = aws_lb.app_alb.dns_name
}
output "db_endpoint" {
  value = aws_db_instance.postgres_db.endpoint
}
output "redis_endpoint" {
  value = aws_elasticache_cluster.redis_cache.cache_nodes[0].address
}
output "s3_bucket_name" {
  value = aws_s3_bucket.media_assets.id
}
